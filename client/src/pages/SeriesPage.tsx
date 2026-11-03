import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as seriesApi from '../api/series.api.js';
import * as ticketApi from '../api/ticket.api.js';
import { SeriesDiscoveryItem } from '../types/index.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { ApiError } from '../api/client.js';
import { TicketIcon, ToyBoxIcon, ClockIcon } from '../components/icons.js';

function getSeriesColors(code: string) {
  switch (code.toUpperCase()) {
    case 'CRY':
      return { accent: '#BE123C', softBg: '#FFE4EC', chipClass: 'series-chip-cry' };
    case 'LAB':
      return { accent: '#C2410C', softBg: '#FFEDD5', chipClass: 'series-chip-lab' };
    case 'SKP':
      return { accent: '#6D28D9', softBg: '#EDE9FE', chipClass: 'series-chip-skp' };
    default:
      return { accent: 'var(--color-primary)', softBg: 'var(--color-primary-soft)', chipClass: '' };
  }
}

export function SeriesPage(): React.JSX.Element {
  const [seriesList, setSeriesList] = useState<SeriesDiscoveryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<{ code?: string; message: string } | null>(null);
  const [joinError, setJoinError] = useState<{ code?: string; message: string } | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadSeries = useCallback(async () => {
    setIsLoading(true);
    setPageError(null);
    try {
      const res = await seriesApi.getSeries();
      setSeriesList(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setPageError({ code: err.code, message: err.message });
      } else {
        setPageError({ message: 'ไม่สามารถดึงข้อมูลรายการซีรีส์ได้' });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  const handleJoin = async (seriesId: string) => {
    setJoinError(null);
    setJoiningId(seriesId);
    try {
      const res = await ticketApi.joinQueue(seriesId);
      if (res.data) {
        navigate('/my-ticket');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setJoinError({ code: err.code, message: err.message });
      } else {
        setJoinError({ message: 'ไม่สามารถเข้าคิวได้ กรุณาลองใหม่อีกครั้ง' });
      }
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ color: 'var(--color-primary)' }} aria-hidden="true">
            <TicketIcon size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            รายการซีรีส์ (Series Discovery)
          </h2>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          เลือกซีรีส์ที่ต้องการรับบริการ Unboxing สดที่หน้าร้าน
        </p>
      </div>

      {pageError && (
        <div style={{ marginBottom: '18px' }}>
          <ErrorAlert
            code={pageError.code}
            message={pageError.message}
            onRetry={loadSeries}
          />
        </div>
      )}

      {joinError && (
        <div style={{ marginBottom: '18px' }}>
          <ErrorAlert code={joinError.code} message={joinError.message} />
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton text="กำลังโหลดรายการซีรีส์..." />
      ) : seriesList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              backgroundColor: 'var(--color-primary-soft)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
            }}
            aria-hidden="true"
          >
            <ToyBoxIcon size={32} />
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem', fontWeight: 500 }}>
            ไม่มีรายการซีรีส์เปิดให้บริการในขณะนี้
          </p>
        </div>
      ) : (
        <div className="series-grid">
          {seriesList.map((item) => {
            const colors = getSeriesColors(item.code);
            return (
              <div
                key={item.id}
                className={`card series-card ${!item.isActive ? 'series-card-closed' : ''}`}
                data-series={item.code}
                style={{
                  opacity: item.isActive ? 1 : 0.85,
                  backgroundColor: item.isActive ? '#FFFFFF' : '#FAFAFA',
                }}
              >
                {/* 6px Accent Stripe */}
                <div
                  className="series-card-top-stripe"
                  style={{
                    backgroundColor: item.isActive ? colors.accent : '#CBD5E1',
                  }}
                  aria-hidden="true"
                />

                <div className="series-card-content">
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <span className={`series-chip ${colors.chipClass}`}>{item.code}</span>
                      {item.isActive ? (
                        <span className="badge badge-waiting">เปิดให้บริการ</span>
                      ) : (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: '#F1F5F9',
                            color: 'var(--color-muted)',
                            borderColor: '#E2E8F0',
                          }}
                        >
                          ปิดรับคิว
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        lineHeight: 1.3,
                        marginBottom: '6px',
                      }}
                    >
                      {item.name}
                    </h3>
                  </div>

                  <div>
                    <div
                      style={{
                        padding: '12px 14px',
                        backgroundColor: item.isActive ? 'var(--color-bg)' : '#F1F5F9',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '14px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--color-muted)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <ClockIcon size={16} />
                        <span>สถานะคิว</span>
                      </div>
                      <div
                        className="tabular-nums"
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: item.isActive ? colors.accent : 'var(--color-muted)',
                        }}
                      >
                        {item.waitingCount} คิวรอ
                      </div>
                    </div>

                    {item.isActive ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={joiningId !== null}
                        onClick={() => handleJoin(item.id)}
                      >
                        {joiningId === item.id ? 'กำลังเข้าคิว...' : 'เข้าคิว (Join Queue)'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn"
                        style={{ width: '100%' }}
                        disabled
                      >
                        ปิดรับคิว
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SeriesPage;
