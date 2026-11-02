import React, { useState, useEffect, useCallback } from 'react';
import * as staffApi from '../api/staff.api.js';
import { StaffSeriesQueueDto } from '../types/index.js';
import { SeriesSelector } from '../components/SeriesSelector.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { usePolling } from '../hooks/usePolling.js';
import { ApiError } from '../api/client.js';

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
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          เคาน์เตอร์บริการ (Staff Counter)
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
          จัดการเรียกคิวและให้บริการ Unboxing สดประจำซีรีส์
        </p>
      </div>

      {actionError && (
        <div style={{ marginBottom: '16px' }}>
          <ErrorAlert code={actionError.code} message={actionError.message} />
        </div>
      )}

      {seriesList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: 'var(--color-muted)' }}>
            คุณยังไม่ได้รับมอบหมายให้ประจำการซีรีส์ใด
          </p>
        </div>
      ) : (
        <>
          <SeriesSelector
            seriesList={seriesList}
            selectedSeriesId={selectedSeriesId}
            onSelect={setSelectedSeriesId}
          />

          {/* Current Serving Section */}
          <div className="card" style={{ marginBottom: '16px', borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
              กำลังให้บริการ (Current Serving)
            </h3>

            {currentSeries?.activeServing ? (
              <div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    margin: '6px 0',
                  }}
                >
                  {currentSeries.activeServing.displayNumber}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span
                    className={`badge ${
                      currentSeries.activeServing.status === 'CALLED'
                        ? 'badge-called'
                        : 'badge-unboxing'
                    }`}
                  >
                    {currentSeries.activeServing.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {currentSeries.activeServing.status === 'CALLED' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleStartUnboxing}
                      disabled={isActing}
                      style={{ width: '100%' }}
                    >
                      Verify & Start Unboxing
                    </button>
                  )}

                  {currentSeries.activeServing.status === 'UNBOXING' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleComplete}
                      disabled={isActing}
                      style={{ width: '100%' }}
                    >
                      เสร็จสิ้น (Complete)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                ยังไม่มีคิวที่กำลังให้บริการ
              </p>
            )}
          </div>

          {/* Action Call Next */}
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={isActing || currentSeries?.activeServing !== null}
              onClick={handleCallNext}
            >
              เรียกคิวถัดไป (Call Next)
            </button>
            {currentSeries?.activeServing !== null && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-muted)',
                  marginTop: '4px',
                  textAlign: 'center',
                }}
              >
                * ต้องเสร็จสิ้นคิวปัจจุบันก่อนจึงจะเรียกคิวถัดไปได้
              </div>
            )}
          </div>

          {/* Waiting Queue List */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
              รายการคิวรอ ({currentSeries?.waitingQueue.length || 0} คิว)
            </h3>

            {currentSeries?.waitingQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-muted)' }}>
                ยังไม่มีคิวรอรับบริการ
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentSeries?.waitingQueue.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', marginRight: '8px' }}>
                        {t.displayNumber}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                        ({t.userFullName})
                      </span>
                    </div>
                    <span className="badge badge-waiting">WAITING</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StaffCounterPage;
