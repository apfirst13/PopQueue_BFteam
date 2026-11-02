import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as seriesApi from '../api/series.api.js';
import * as ticketApi from '../api/ticket.api.js';
import { SeriesDiscoveryItem } from '../types/index.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { ApiError } from '../api/client.js';

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
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          รายการซีรีส์ (Series Discovery)
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
          เลือกซีรีส์ที่ต้องการรับบริการ Unboxing สดที่หน้าร้าน
        </p>
      </div>

      {pageError && (
        <div style={{ marginBottom: '16px' }}>
          <ErrorAlert
            code={pageError.code}
            message={pageError.message}
            onRetry={loadSeries}
          />
        </div>
      )}

      {joinError && (
        <div style={{ marginBottom: '16px' }}>
          <ErrorAlert code={joinError.code} message={joinError.message} />
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton text="กำลังโหลดรายการซีรีส์..." />
      ) : seriesList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: 'var(--color-muted)' }}>
            ไม่มีรายการซีรีส์เปิดให้บริการในขณะนี้
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {seriesList.map((item) => (
            <div key={item.id} className="card" data-series={item.code}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.name}</h3>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-muted)',
                      marginTop: '2px',
                    }}
                  >
                    รหัสซีรีส์: <span style={{ fontWeight: 600 }}>{item.code}</span>
                  </div>
                </div>

                {item.isActive ? (
                  <span className="badge badge-waiting">เปิดให้บริการ</span>
                ) : (
                  <span
                    className="badge"
                    style={{ backgroundColor: '#F1F5F9', color: 'var(--color-muted)' }}
                  >
                    ปิดรับคิว
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  marginBottom: '14px',
                  color: 'var(--color-text)',
                }}
              >
                จำนวนคิวรอขณะนี้:{' '}
                <strong style={{ color: 'var(--color-primary)' }}>
                  {item.waitingCount} คิวรอ
                </strong>
              </div>

              {item.isActive ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={joiningId !== null}
                  onClick={() => handleJoin(item.id)}
                >
                  {joiningId === item.id
                    ? 'กำลังเข้าคิว...'
                    : 'เข้าคิว (Join Queue)'}
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
          ))}
        </div>
      )}
    </div>
  );
}

export default SeriesPage;
