import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as ticketApi from '../api/ticket.api.js';
import { ActiveTicket } from '../types/index.js';
import { CountdownTimer } from '../components/CountdownTimer.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { usePolling } from '../hooks/usePolling.js';
import { ApiError } from '../api/client.js';

export function MyTicketPage(): React.JSX.Element {
  const [ticket, setTicket] = useState<ActiveTicket | null>(null);
  const [isNoTicket, setIsNoTicket] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ code?: string; message: string } | null>(null);

  const loadTicket = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setError(null);
    }
    try {
      const res = await ticketApi.getMyTicket();
      if (res.data?.ticket) {
        setTicket(res.data.ticket);
        setIsNoTicket(false);
        setError(null);
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === 'NO_ACTIVE_TICKET') {
        setIsNoTicket(true);
        setTicket(null);
        setError(null);
      } else {
        if (!isSilent) {
          if (err instanceof ApiError) {
            setError({ code: err.code, message: err.message });
          } else {
            setError({ message: 'ไม่สามารถดึงข้อมูลบัตรคิวได้ กรุณาลองใหม่อีกครั้ง' });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTicket(false);
  }, [loadTicket]);

  // 3-second Polling when ticket is active
  usePolling(() => {
    loadTicket(true);
  }, 3000, !isLoading && ticket !== null && ticket.status !== 'COMPLETED');

  if (isLoading) {
    return <LoadingSkeleton text="กำลังตรวจสอบข้อมูลบัตรคิว..." />;
  }

  if (error) {
    return (
      <div style={{ marginTop: '20px' }}>
        <ErrorAlert
          code={error.code}
          message={error.message}
          onRetry={() => {
            setIsLoading(true);
            loadTicket(false);
          }}
        />
      </div>
    );
  }

  if (isNoTicket || !ticket) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '36px 16px', marginTop: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
          ยังไม่มีบัตรคิว
        </h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '20px' }}>
          คุณยังไม่มีบัตรคิวที่กำลังใช้งานในขณะนี้
        </p>
        <Link to="/series" className="btn btn-primary">
          เลือกซีรีส์และรับบัตรคิว
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          บัตรคิวของคุณ (Virtual Ticket)
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
          ระบบจะอัปเดตสถานะคิวแบบเรียลไทม์อัตโนมัติทุก 3 วินาที
        </p>
      </div>

      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          borderTop: '4px solid var(--color-primary)',
        }}
      >
        <div style={{ fontSize: '1rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
          {ticket.series.name} ({ticket.series.code})
        </div>

        <div
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '1px',
            margin: '8px 0',
          }}
        >
          {ticket.displayNumber}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <span
            className={`badge ${
              ticket.status === 'WAITING'
                ? 'badge-waiting'
                : ticket.status === 'CALLED'
                  ? 'badge-called'
                  : ticket.status === 'UNBOXING'
                    ? 'badge-unboxing'
                    : 'badge-completed'
            }`}
            style={{ fontSize: '0.85rem', padding: '4px 12px' }}
          >
            {ticket.status}
          </span>
        </div>

        {ticket.status === 'WAITING' && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              marginTop: '12px',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
              เหลืออีก {ticket.waitingAhead} คิวก่อนหน้า
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '4px' }}>
              กรุณารอรับการเรียกคิวจากพนักงานหน้าร้าน
            </div>
          </div>
        )}

        {ticket.status === 'CALLED' && (
          <div style={{ marginTop: '12px' }}>
            <CountdownTimer initialSeconds={120} />
          </div>
        )}

        {ticket.status === 'UNBOXING' && (
          <div
            className="alert"
            style={{
              backgroundColor: '#FAF5FF',
              color: '#7E22CE',
              border: '1px solid #E9D5FF',
              textAlign: 'center',
              padding: '16px',
              marginTop: '12px',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            <div>กำลังให้บริการ</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '4px' }}>
              พนักงาน Box Master กำลังเปิดกล่อง Unboxing สดของคุณ
            </div>
          </div>
        )}

        {ticket.status === 'COMPLETED' && (
          <div
            className="alert"
            style={{
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              border: '1px solid #BBF7D0',
              textAlign: 'center',
              padding: '16px',
              marginTop: '12px',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              การให้บริการเสร็จสิ้นแล้ว
            </div>
            <div style={{ marginTop: '12px' }}>
              <Link to="/series" className="btn btn-primary" style={{ width: '100%' }}>
                เลือกซีรีส์และรับบัตรคิวใหม่
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTicketPage;
