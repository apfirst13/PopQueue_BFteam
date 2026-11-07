import React from 'react';
import { AlertCircleIcon, RefreshIcon } from './icons.js';

interface ErrorAlertProps {
  code?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ code, message, onRetry }: ErrorAlertProps): React.JSX.Element {
  return (
    <div className="alert alert-error pop-in" role="alert">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          <AlertCircleIcon size={18} />
        </div>
        <div style={{ flex: 1 }}>
          {code && (
            <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginRight: '6px' }}>
              [{code}]
            </span>
          )}
          <span>{message}</span>
        </div>
      </div>
      {onRetry && (
        <div style={{ marginTop: '8px', paddingLeft: '26px' }}>
          <button
            onClick={onRetry}
            className="btn btn-outline"
            style={{
              minHeight: '38px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-error)',
              borderColor: 'var(--color-error)',
              gap: '6px',
            }}
          >
            <RefreshIcon size={14} />
            <span>ลองใหม่</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ErrorAlert;
