import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as ticketApi from '../api/ticket.api.js';
import { ActiveTicket } from '../types/index.js';
import { CountdownTimer } from '../components/CountdownTimer.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { LoadingSkeleton } from '../components/LoadingSkeleton.js';
import { usePolling } from '../hooks/usePolling.js';
import { ApiError } from '../api/client.js';
import {
  TicketIcon,
  ToyBoxIcon,
  ClockIcon,
  BellIcon,
  CheckIcon,
  SparklesIcon,
} from '../components/icons.js';

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
      <div className="card" style={{ textAlign: 'center', padding: '48px 20px', marginTop: '16px' }}>
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
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '8px' }}>
          ยังไม่มีบัตรคิว
        </h2>
        <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
          คุณยังไม่มีบัตรคิวที่กำลังใช้งานในขณะนี้
        </p>
        <Link to="/series" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <TicketIcon size={18} />
          <span>เลือกซีรีส์และรับบัตรคิว</span>
        </Link>
      </div>
    );
  }

  const colors = getSeriesColors(ticket.series.code);

  // Stepper calculations
  const steps = [
    { label: 'เข้าคิว', status: 'WAITING', icon: ClockIcon },
    { label: 'เรียกคิว', status: 'CALLED', icon: BellIcon },
    { label: 'เปิดกล่องสด', status: 'UNBOXING', icon: ToyBoxIcon },
    { label: 'เสร็จสิ้น', status: 'COMPLETED', icon: CheckIcon },
  ];

  const statusOrder: Record<string, number> = {
    WAITING: 0,
    CALLED: 1,
    UNBOXING: 2,
    COMPLETED: 3,
  };

  const currentStepIdx = statusOrder[ticket.status] ?? 0;

  return (
    <div className="ticket-wrapper">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ color: 'var(--color-primary)' }} aria-hidden="true">
            <TicketIcon size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
            บัตรคิวของคุณ (Virtual Ticket)
          </h2>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          ระบบจะอัปเดตสถานะคิวแบบเรียลไทม์อัตโนมัติทุก 3 วินาที
        </p>
      </div>

      {/* 4-Step Stepper */}
      <div className="stepper-container" aria-label="สถานะขั้นตอนการรับบริการ">
        {steps.map((step, idx) => {
          const isDone = currentStepIdx > idx;
          const isCurrent = currentStepIdx === idx;
          const StepIcon = step.icon;

          return (
            <div
              key={step.status}
              className={`step-item ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}`}
            >
              <div className="step-icon-circle">
                {isDone ? <CheckIcon size={14} /> : <StepIcon size={14} />}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Realistic Virtual Ticket Card */}
      <div className="card virtual-ticket-card" style={{ padding: 0 }}>
        {/* Top Header of Ticket */}
        <div
          className="ticket-header-strip"
          style={{
            backgroundColor: colors.softBg,
            borderBottom: `2px dashed ${colors.accent}`,
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.accent, textTransform: 'uppercase' }}>
              Series Unboxing Ticket
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {ticket.series.name} ({ticket.series.code})
            </div>
          </div>
          <span className={`series-chip ${colors.chipClass}`}>{ticket.series.code}</span>
        </div>

        {/* Ticket Divider Notches */}
        <div className="ticket-divider-container" aria-hidden="true">
          <div className="ticket-notch-left" />
          <div className="ticket-dashed-line" />
          <div className="ticket-notch-right" />
        </div>

        {/* Bottom Body of Ticket */}
        <div className="ticket-body">
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase' }}>
            หมายเลขคิวของคุณ
          </div>

          {/* Ticket Display Number - Preserving style for Playwright locator */}
          <div
            className="tabular-nums"
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '1.5px',
              margin: '8px 0',
              fontFamily: 'var(--font-display)',
            }}
          >
            {ticket.displayNumber}
          </div>

          <div style={{ marginBottom: '18px' }}>
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
              style={{ fontSize: '0.875rem', padding: '6px 16px' }}
            >
              {ticket.status === 'WAITING' && <ClockIcon size={14} />}
              {ticket.status === 'CALLED' && <BellIcon size={14} />}
              {ticket.status === 'UNBOXING' && <ToyBoxIcon size={14} />}
              {ticket.status === 'COMPLETED' && <CheckIcon size={14} />}
              <span>{ticket.status}</span>
            </span>
          </div>

          {/* State 1: WAITING */}
          {ticket.status === 'WAITING' && (
            <div
              className="pop-in"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--color-waiting-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #BFDBFE',
                marginTop: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--color-waiting-text)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                เหลืออีก {ticket.waitingAhead} คิวก่อนหน้า
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                กรุณารอรับการเรียกคิวจากพนักงานหน้าร้าน
              </div>
            </div>
          )}

          {/* State 2: CALLED */}
          {ticket.status === 'CALLED' && (
            <div style={{ width: '100%', marginTop: '8px' }}>
              <CountdownTimer initialSeconds={120} />
            </div>
          )}

          {/* State 3: UNBOXING */}
          {ticket.status === 'UNBOXING' && (
            <div
              className="alert pop-in"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-unboxing-bg)',
                color: 'var(--color-unboxing-text)',
                border: '1.5px solid #E9D5FF',
                borderLeft: '6px solid var(--color-unboxing-text)',
                textAlign: 'center',
                padding: '18px 16px',
                marginTop: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div className="animate-shake" aria-hidden="true">
                  <ToyBoxIcon size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                  กำลังให้บริการ
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 500, marginTop: '6px' }}>
                พนักงาน Box Master กำลังเปิดกล่อง Unboxing สดของคุณ
              </div>
            </div>
          )}

          {/* State 4: COMPLETED */}
          {ticket.status === 'COMPLETED' && (
            <div
              className="alert pop-in"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                border: '1.5px solid #BBF7D0',
                borderLeft: '6px solid var(--color-success)',
                textAlign: 'center',
                padding: '20px 16px',
                marginTop: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <SparklesIcon size={22} />
                <div style={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                  การให้บริการเสร็จสิ้นแล้ว
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                ขอบคุณที่ใช้บริการ Live Unboxing ประจำสถานี PopQueue
              </p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/series" className="btn btn-primary" style={{ width: '100%' }}>
                  <TicketIcon size={18} />
                  <span>เลือกซีรีส์และรับบัตรคิวใหม่</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTicketPage;
