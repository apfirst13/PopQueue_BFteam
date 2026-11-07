import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon } from '../components/icons.js';

export function ForbiddenPage(): React.JSX.Element {
  return (
    <div
      className="card pop-in"
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        maxWidth: '440px',
        margin: '40px auto 0',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 20px',
          backgroundColor: 'var(--color-error-bg)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-error)',
          border: '2px solid #FECACA',
        }}
        aria-hidden="true"
      >
        <LockIcon size={36} />
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          color: 'var(--color-error)',
          marginBottom: '10px',
        }}
      >
        403 - ไม่มีสิทธิ์เข้าถึง
      </h2>

      <p style={{ color: 'var(--color-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
        คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชีที่ได้รับอนุญาต
      </p>

      <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
}

export default ForbiddenPage;
