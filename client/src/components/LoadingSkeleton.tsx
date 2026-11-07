import React from 'react';
import { ToyBoxIcon } from './icons.js';

export function LoadingSkeleton({ text = 'กำลังโหลดข้อมูล...' }: { text?: string }): React.JSX.Element {
  return (
    <div
      style={{
        padding: '36px 24px',
        textAlign: 'center',
        color: 'var(--color-muted)',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '2px dashed var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}
    >
      <div style={{ color: 'var(--color-primary)' }} className="animate-shake" aria-hidden="true">
        <ToyBoxIcon size={32} />
      </div>
      <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{text}</div>
    </div>
  );
}

export default LoadingSkeleton;
