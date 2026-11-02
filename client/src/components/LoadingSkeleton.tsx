import React from 'react';

export function LoadingSkeleton({ text = 'กำลังโหลดข้อมูล...' }: { text?: string }): React.JSX.Element {
  return (
    <div
      style={{
        padding: '24px',
        textAlign: 'center',
        color: 'var(--color-muted)',
        backgroundColor: '#F1F5F9',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div>{text}</div>
    </div>
  );
}
