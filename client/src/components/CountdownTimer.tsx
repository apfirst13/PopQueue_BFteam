import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
}

export function CountdownTimer({ initialSeconds = 120 }: CountdownTimerProps): React.JSX.Element {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className="alert alert-warning"
      style={{
        textAlign: 'center',
        padding: '16px',
        margin: '12px 0',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
        ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>
        {formatted}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '2px' }}>
        กรุณาแสดงหน้าจอนี้ต่อพนักงาน Box Master ประจำเคาน์เตอร์
      </div>
    </div>
  );
}
