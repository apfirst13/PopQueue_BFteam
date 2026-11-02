import React from 'react';

interface ErrorAlertProps {
  code?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ code, message, onRetry }: ErrorAlertProps): React.JSX.Element {
  return (
    <div className="alert alert-error" role="alert">
      {code && (
        <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
          [{code}]
        </span>
      )}
      <span>{message}</span>
      {onRetry && (
        <div style={{ marginTop: '8px' }}>
          <button
            onClick={onRetry}
            className="btn btn-outline"
            style={{
              minHeight: '36px',
              padding: '4px 12px',
              fontSize: '0.85rem',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-error)',
              borderColor: 'var(--color-error)',
            }}
          >
            ลองใหม่
          </button>
        </div>
      )}
    </div>
  );
}
