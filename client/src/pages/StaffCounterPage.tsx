import React, { useState, useEffect, useCallback } from 'react';
import * as staffApi from '../api/staff.api.js';
import { ActiveServingTicketDto, StaffSeriesQueueDto } from '../types/index.js';
import { SeriesSelector } from '../components/SeriesSelector.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { usePolling } from '../hooks/usePolling.js';
import { ApiError } from '../api/client.js';
import {
  NO_SHOW_SECONDS,
  computeServerOffsetMs,
  computeNoShowRemainingSeconds,
} from '../utils/countdown.js';
import {
  ToyBoxIcon,
  BellIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
} from '../components/icons.js';

export function StaffCounterPage(): React.JSX.Element {
  const [seriesList, setSeriesList] = useState<StaffSeriesQueueDto[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [serverOffsetMs, setServerOffsetMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<{ code?: string; message: string } | null>(null);
  const [isActing, setIsActing] = useState<boolean>(false);
  const [pendingNoShowTicket, setPendingNoShowTicket] = useState<ActiveServingTicketDto | null>(null);
  const [isMarkingNoShow, setIsMarkingNoShow] = useState<boolean>(false);
  const [noShowError, setNoShowError] = useState<{ code?: string; message: string } | null>(null);
  const [toastState, setToastState] = useState<{
    type: 'success' | 'error';
    code?: string;
    message: string;
  } | null>(null);
  const [togglingSeriesId, setTogglingSeriesId] = useState<string | null>(null);

  const loadTickets = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setActionError(null);
    }
    try {
      const res = await staffApi.getStaffTickets();
      const list = res.data?.series || [];
      setSeriesList(list);
      if (res.data?.serverNow) {
        setServerOffsetMs(computeServerOffsetMs(res.data.serverNow));
      }
      setSelectedSeriesId((prev) => {
        if (prev && list.some((s) => s.seriesId === prev)) {
          return prev;
        }
        return list[0]?.seriesId || '';
      });
    } catch (err) {
      if (!isSilent) {
        if (err instanceof ApiError) {
          setActionError({ code: err.code, message: err.message });
        } else {
          setActionError({ message: 'ไม่สามารถโหลดข้อมูลเคาน์เตอร์บริการได้' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets(false);
  }, [loadTickets]);

  useEffect(() => {
    if (!toastState) return;
    const timer = setTimeout(() => setToastState(null), 5000);
    return () => clearTimeout(timer);
  }, [toastState]);

  // 3-second Polling for Staff Counter
  usePolling(() => {
    loadTickets(true);
  }, 3000, !isLoading);

  const currentSeries = seriesList.find((s) => s.seriesId === selectedSeriesId) || seriesList[0];
  const activeServing = currentSeries?.activeServing ?? null;
  const activeCalledAt = activeServing?.status === 'CALLED' ? activeServing.calledAt : null;

  const [noShowRemainingSeconds, setNoShowRemainingSeconds] = useState<number>(() =>
    activeCalledAt
      ? computeNoShowRemainingSeconds(activeCalledAt, serverOffsetMs, NO_SHOW_SECONDS)
      : NO_SHOW_SECONDS,
  );

  useEffect(() => {
    if (!activeCalledAt) {
      setNoShowRemainingSeconds(NO_SHOW_SECONDS);
      return;
    }

    const updateCountdown = () => {
      setNoShowRemainingSeconds(
        computeNoShowRemainingSeconds(activeCalledAt, serverOffsetMs, NO_SHOW_SECONDS),
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [activeServing?.id, activeCalledAt, serverOffsetMs]);

  const handleCallNext = async () => {
    if (!currentSeries) return;
    setActionError(null);
    setIsActing(true);
    try {
      const res = await staffApi.callNext(currentSeries.seriesId);
      if (res.data?.serverNow) {
        setServerOffsetMs(computeServerOffsetMs(res.data.serverNow));
      }
      await loadTickets(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError({ code: err.code, message: err.message });
      } else {
        setActionError({ message: 'เกิดข้อผิดพลาดในการเรียกคิว' });
      }
    } finally {
      setIsActing(false);
    }
  };

  const handleToggleSeriesStatus = async (seriesId: string, nextIsActive: boolean) => {
    if (togglingSeriesId) return;
    const targetSeries = seriesList.find((s) => s.seriesId === seriesId);
    const previousIsActive = targetSeries?.isActive ?? true;

    setToastState(null);
    setTogglingSeriesId(seriesId);
    setSeriesList((prev) =>
      prev.map((s) => (s.seriesId === seriesId ? { ...s, isActive: nextIsActive } : s)),
    );

    try {
      const result = await staffApi.updateSeriesStatus(seriesId, nextIsActive);
      const confirmedIsActive = result.data.isActive;
      setSeriesList((prev) =>
        prev.map((s) => (s.seriesId === seriesId ? { ...s, isActive: confirmedIsActive } : s)),
      );
      setToastState({
        type: 'success',
        message: confirmedIsActive ? 'เปิดรับคิวสำเร็จ' : 'ปิดรับคิวเรียบร้อย',
      });
      await loadTickets(true);
    } catch (err) {
      setSeriesList((prev) =>
        prev.map((s) => (s.seriesId === seriesId ? { ...s, isActive: previousIsActive } : s)),
      );
      if (err instanceof ApiError) {
        setToastState({ type: 'error', code: err.code, message: err.message });
      } else {
        setToastState({
          type: 'error',
          message: 'ไม่สามารถอัปเดตสถานะเปิด-ปิดซีรีส์ได้ กรุณาลองใหม่อีกครั้ง',
        });
      }
    } finally {
      setTogglingSeriesId(null);
    }
  };

  const handleRequestNoShow = (ticket: ActiveServingTicketDto) => {
    setNoShowError(null);
    setPendingNoShowTicket(ticket);
  };

  const handleCloseNoShowModal = () => {
    if (isMarkingNoShow) return;
    setPendingNoShowTicket(null);
    setNoShowError(null);
  };

  const handleConfirmNoShow = async () => {
    if (!pendingNoShowTicket || isMarkingNoShow) return;
    setNoShowError(null);
    setIsMarkingNoShow(true);
    try {
      const result = await staffApi.markNoShow(pendingNoShowTicket.id);
      setPendingNoShowTicket(null);
      setToastState({
        type: 'success',
        message: `ตัดสิทธิ์ No-Show คิว ${result.data.displayNumber} สำเร็จ`,
      });
      await loadTickets(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setNoShowError({ code: err.code, message: err.message });
        if (
          err.code === 'NO_SHOW_WINDOW_NOT_EXPIRED' ||
          err.code === 'INVALID_STATE_TRANSITION' ||
          err.code === 'RESOURCE_NOT_FOUND'
        ) {
          void loadTickets(true);
        }
      } else {
        setNoShowError({ message: 'ไม่สามารถตัดสิทธิ์ No-Show ได้ กรุณาลองใหม่อีกครั้ง' });
      }
    } finally {
      setIsMarkingNoShow(false);
    }
  };

  const handleStartUnboxing = async () => {
    if (!currentSeries?.activeServing) return;
    setActionError(null);
    setIsActing(true);
    try {
      await staffApi.startUnboxing(currentSeries.activeServing.id);
      await loadTickets(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError({ code: err.code, message: err.message });
      } else {
        setActionError({ message: 'เกิดข้อผิดพลาดในการเริ่มให้บริการ' });
      }
    } finally {
      setIsActing(false);
    }
  };

  const handleComplete = async () => {
    if (!currentSeries?.activeServing) return;
    setActionError(null);
    setIsActing(true);
    try {
      await staffApi.completeTicket(currentSeries.activeServing.id);
      await loadTickets(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError({ code: err.code, message: err.message });
      } else {
        setActionError({ message: 'เกิดข้อผิดพลาดในการจบบริการ' });
      }
    } finally {
      setIsActing(false);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton text="กำลังโหลดข้อมูลเคาน์เตอร์..." />;
  }

  return (
    <div>
      {toastState && (
        <div
          className={`alert pop-in ${toastState.type === 'success' ? 'toast-success' : 'alert-error'}`}
          role={toastState.type === 'success' ? 'status' : 'alert'}
          style={{ marginBottom: '16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              {toastState.type === 'success' && <CheckIcon size={18} />}
              <span>
                {toastState.code ? `[${toastState.code}] ` : ''}
                {toastState.message}
              </span>
            </div>
            <button
              type="button"
              className="toast-dismiss-btn"
              aria-label="ปิดการแจ้งเตือน"
              onClick={() => setToastState(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ color: 'var(--color-primary)' }} aria-hidden="true">
            <ToyBoxIcon size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            เคาน์เตอร์บริการ (Staff Counter)
          </h2>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          จัดการเรียกคิวและให้บริการ Unboxing สดประจำซีรีส์
        </p>
      </div>

      {actionError && (
        <div style={{ marginBottom: '18px' }}>
          <ErrorAlert code={actionError.code} message={actionError.message} />
        </div>
      )}

      {seriesList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>
            คุณยังไม่ได้รับมอบหมายให้ประจำการซีรีส์ใด
          </p>
        </div>
      ) : (
        <div className="staff-counter-grid">
          {/* Left Column (~60% on Desktop): Controls & Serving */}
          <div>
            <SeriesSelector
              seriesList={seriesList}
              selectedSeriesId={selectedSeriesId}
              onSelect={setSelectedSeriesId}
              onToggleStatus={handleToggleSeriesStatus}
              togglingSeriesId={togglingSeriesId}
            />

            {/* Current Serving Card */}
            <div
              className="card staff-serving-card"
              style={{
                marginBottom: '16px',
                padding: '24px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ color: 'var(--color-primary)' }} aria-hidden="true">
                  <ToyBoxIcon size={20} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  กำลังให้บริการ (Current Serving)
                </h3>
              </div>

              {currentSeries?.activeServing ? (
                <div className="pop-in">
                  <div
                    className="tabular-nums"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                      lineHeight: 1.1,
                      margin: '10px 0',
                    }}
                  >
                    {currentSeries.activeServing.displayNumber}
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <span
                      className={`badge ${
                        currentSeries.activeServing.status === 'CALLED'
                          ? 'badge-called'
                          : 'badge-unboxing'
                      }`}
                      style={{ fontSize: '0.875rem', padding: '6px 14px' }}
                    >
                      {currentSeries.activeServing.status === 'CALLED' && <BellIcon size={14} />}
                      {currentSeries.activeServing.status === 'UNBOXING' && <ToyBoxIcon size={14} />}
                      <span>{currentSeries.activeServing.status}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {currentSeries.activeServing.status === 'CALLED' && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary staff-action-btn"
                          onClick={handleStartUnboxing}
                          disabled={isActing || isMarkingNoShow}
                          style={{ flex: '1 1 200px' }}
                        >
                          <ToyBoxIcon size={20} />
                          <span>Verify & Start Unboxing</span>
                        </button>
                        <button
                          type="button"
                          className={`btn staff-action-btn ${
                            noShowRemainingSeconds > 0 ? 'btn-secondary' : 'btn-danger'
                          }`}
                          onClick={() => activeServing && handleRequestNoShow(activeServing)}
                          disabled={noShowRemainingSeconds > 0 || isActing || isMarkingNoShow}
                          aria-label={
                            noShowRemainingSeconds > 0
                              ? `ตัดสิทธิ์ No-Show (รออีก ${noShowRemainingSeconds} วินาที)`
                              : 'ตัดสิทธิ์ No-Show'
                          }
                          style={{ flex: '1 1 180px' }}
                        >
                          <ClockIcon size={20} />
                          <span>
                            {noShowRemainingSeconds > 0
                              ? `รออีก ${noShowRemainingSeconds} วินาที`
                              : 'ตัดสิทธิ์ No-Show'}
                          </span>
                        </button>
                      </>
                    )}

                    {currentSeries.activeServing.status === 'UNBOXING' && (
                      <button
                        type="button"
                        className="btn btn-primary staff-action-btn"
                        onClick={handleComplete}
                        disabled={isActing}
                        style={{ width: '100%', backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                      >
                        <CheckIcon size={20} />
                        <span>เสร็จสิ้น (Complete)</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', padding: '12px 0' }}>
                  ยังไม่มีคิวที่กำลังให้บริการ
                </p>
              )}
            </div>

            {/* Action Call Next Button */}
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                className="btn btn-primary staff-action-btn"
                style={{ width: '100%' }}
                disabled={isActing || currentSeries?.activeServing !== null}
                onClick={handleCallNext}
              >
                <BellIcon size={22} />
                <span>เรียกคิวถัดไป (Call Next)</span>
              </button>
              {currentSeries?.activeServing !== null && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-muted)',
                    marginTop: '8px',
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  * ต้องเสร็จสิ้นคิวปัจจุบันก่อนจึงจะเรียกคิวถัดไปได้
                </div>
              )}
            </div>
          </div>

          {/* Right Column (~40% on Desktop): Waiting Queue List */}
          <div className="card" style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                borderBottom: '2px solid var(--color-border)',
                paddingBottom: '10px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                รายการคิวรอ ({currentSeries?.waitingQueue.length || 0} คิว)
              </h3>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-muted)',
                  backgroundColor: 'var(--color-bg)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                FIFO Queue
              </span>
            </div>

            {currentSeries?.waitingQueue.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '36px 16px',
                  color: 'var(--color-muted)',
                  fontSize: '0.95rem',
                }}
              >
                <div style={{ marginBottom: '8px', opacity: 0.7 }}>
                  <ClockIcon size={28} />
                </div>
                <div>ยังไม่มีคิวรอรับบริการ</div>
              </div>
            ) : (
              <div className="waiting-queue-scroll">
                {currentSeries?.waitingQueue.map((t, index) => (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      backgroundColor: index === 0 ? 'var(--color-primary-soft)' : 'var(--color-bg)',
                      borderRadius: 'var(--radius-sm)',
                      border: index === 0 ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="tabular-nums"
                          style={{
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            fontFamily: 'var(--font-display)',
                            color: index === 0 ? 'var(--color-primary)' : 'var(--color-text)',
                          }}
                        >
                          {t.displayNumber}
                        </span>
                        {index === 0 && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: 'var(--color-primary)',
                              color: '#FFFFFF',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            คิวถัดไป
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '2px',
                        }}
                      >
                        <UserIcon size={14} />
                        <span>({t.userFullName})</span>
                      </div>
                    </div>
                    <span className="badge badge-waiting">
                      <ClockIcon size={12} />
                      <span>WAITING</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No-Show Confirmation Modal (F-06, §2.8 DoD) */}
      {pendingNoShowTicket && (
        <div className="modal-backdrop">
          <div
            className="card modal-dialog pop-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="noshow-dialog-title"
            aria-describedby="noshow-dialog-desc"
          >
            <h3
              id="noshow-dialog-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '10px' }}
            >
              ยืนยันการตัดสิทธิ์ No-Show
            </h3>
            <p
              id="noshow-dialog-desc"
              style={{ color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '16px' }}
            >
              ลูกค้าคิว {pendingNoShowTicket.displayNumber} ไม่มาแสดงตัวหลังครบ 120 วินาทีใช่หรือไม่? ตั๋วนี้จะถูกตัดสิทธิ์และคุณจะสามารถเรียกคิวถัดไปได้ทันที
            </p>
            {noShowError && (
              <div style={{ marginBottom: '16px' }}>
                <ErrorAlert code={noShowError.code} message={noShowError.message} />
              </div>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseNoShowModal}
                disabled={isMarkingNoShow}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmNoShow}
                disabled={isMarkingNoShow}
              >
                {isMarkingNoShow ? 'กำลังบันทึก...' : 'ยืนยันตัดสิทธิ์ No-Show'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffCounterPage;
