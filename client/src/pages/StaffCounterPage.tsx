import React, { useState, useEffect, useCallback } from 'react';
import * as staffApi from '../api/staff.api.js';
import { StaffSeriesQueueDto } from '../types/index.js';
import { SeriesSelector } from '../components/SeriesSelector.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { usePolling } from '../hooks/usePolling.js';
import { ApiError } from '../api/client.js';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<{ code?: string; message: string } | null>(null);
  const [isActing, setIsActing] = useState<boolean>(false);

  const loadTickets = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setActionError(null);
    }
    try {
      const res = await staffApi.getStaffTickets();
      const list = res.data?.series || [];
      setSeriesList(list);
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

  // 3-second Polling for Staff Counter
  usePolling(() => {
    loadTickets(true);
  }, 3000, !isLoading);

  const currentSeries = seriesList.find((s) => s.seriesId === selectedSeriesId) || seriesList[0];

  const handleCallNext = async () => {
    if (!currentSeries) return;
    setActionError(null);
    setIsActing(true);
    try {
      await staffApi.callNext(currentSeries.seriesId);
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

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    {currentSeries.activeServing.status === 'CALLED' && (
                      <button
                        type="button"
                        className="btn btn-primary staff-action-btn"
                        onClick={handleStartUnboxing}
                        disabled={isActing}
                        style={{ width: '100%' }}
                      >
                        <ToyBoxIcon size={20} />
                        <span>Verify & Start Unboxing</span>
                      </button>
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
    </div>
  );
}

export default StaffCounterPage;
