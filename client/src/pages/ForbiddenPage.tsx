import React from 'react';
import { Link } from 'react-router-dom';

export function ForbiddenPage(): React.JSX.Element {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
      <h2 style={{ color: 'var(--color-error)', marginBottom: '8px' }}>403 - ไม่มีสิทธิ์เข้าถึง</h2>
      <p style={{ color: 'var(--color-muted)', marginBottom: '16px' }}>
        คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
      </p>
      <Link to="/login" className="btn btn-primary">
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
}
