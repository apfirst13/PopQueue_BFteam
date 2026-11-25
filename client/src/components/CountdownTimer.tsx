import React, { useState, useEffect } from 'react';
import { BellIcon } from './icons.js';
import {
  NO_SHOW_SECONDS,
  computeServerOffsetMs,
  computeNoShowRemainingSeconds,
} from '../utils/countdown.js';

interface CountdownTimerProps {
  initialSeconds?: number;
  calledAt?: string | null;
  serverNow?: string;
}

export function CountdownTimer({
  initialSeconds = NO_SHOW_SECONDS,
  calledAt,
  serverNow,
}: CountdownTimerProps): React.JSX.Element {
  const offsetMs = computeServerOffsetMs(serverNow);
  const hasServerSync = Boolean(calledAt) && offsetMs !== null;

  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    hasServerSync
      ? computeNoShowRemainingSeconds(calledAt, offsetMs, initialSeconds)
      : initialSeconds,
  );

  // Sync mode: recompute remaining seconds from server clock offset on mount, serverNow updates, and every 1s tick
  useEffect(() => {
    if (!hasServerSync) return;

    const syncedOffsetMs = computeServerOffsetMs(serverNow);
    const updateRemaining = () => {
      setSecondsLeft(computeNoShowRemainingSeconds(calledAt, syncedOffsetMs, initialSeconds));
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [hasServerSync, calledAt, serverNow, initialSeconds]);

  // Fallback mode when serverNow / calledAt is omitted in standalone or legacy mocks
  useEffect(() => {
    if (hasServerSync || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [hasServerSync, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = hasServerSync ? NO_SHOW_SECONDS : Math.max(1, initialSeconds);
  const isUrgent = secondsLeft <= 30;
  const strokeColor = isUrgent ? 'var(--color-error)' : 'var(--color-warning)';
  const ringRadius = 42;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset =
    circumference * Math.min(1, Math.max(0, 1 - secondsLeft / totalSeconds));

  return (
    <div
      className="alert alert-warning pop-in"
      style={{
        textAlign: 'center',
        padding: '20px 16px',
        margin: '16px 0',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '6px solid var(--color-warning)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '1.15rem',
          color: isUrgent ? 'var(--color-error)' : 'var(--color-warning)',
        }}
      >
        <BellIcon size={22} />
        <span>ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์</span>
      </div>

      {/* SVG Countdown Ring with Center Time */}
      <div style={{ position: 'relative', width: '110px', height: '110px', margin: '4px 0' }}>
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          {/* Background track circle */}
          <circle
            cx="55"
            cy="55"
            r={ringRadius}
            fill="none"
            stroke="#FED7AA"
            strokeWidth="8"
          />
          {/* Animated countdown stroke */}
          <circle
            cx="55"
            cy="55"
            r={ringRadius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Exact single countdown time string */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: strokeColor,
          }}
          className="tabular-nums"
        >
          {formatted}
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
        กรุณาแสดงหน้าจอนี้ต่อพนักงาน Box Master ประจำเคาน์เตอร์
      </p>
    </div>
  );
}

export default CountdownTimer;
