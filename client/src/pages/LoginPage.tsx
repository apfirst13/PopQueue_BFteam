import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import * as ticketApi from '../api/ticket.api.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { ApiError } from '../api/client.js';
import { ToyBoxIcon, SparklesIcon, TicketIcon } from '../components/icons.js';

export function LoginPage(): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrorCode(undefined);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(username, password);

      if (user.role === 'BOX_MASTER') {
        navigate('/staff/counter');
      } else {
        // Collector: check if active ticket exists
        try {
          const res = await ticketApi.getMyTicket();
          if (res?.data?.ticket) {
            navigate('/my-ticket');
            return;
          }
        } catch (ticketErr) {
          if (ticketErr instanceof ApiError && ticketErr.code === 'NO_ACTIVE_TICKET') {
            navigate('/series');
            return;
          }
        }
        navigate('/series');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorCode(err.code);
        setErrorMsg(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
      } else {
        setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Brand Panel for Tablet & Desktop */}
      <div className="login-brand-panel" aria-hidden="true">
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            <SparklesIcon size={16} />
            <span>Art Toy Boutique Experience</span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              lineHeight: 1.15,
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            PopQueue Station
          </div>

          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.6, maxWidth: '360px' }}>
            ยินดีต้อนรับสู่สถานีเปิดกล่องสุ่ม Art Toy และจัดการคิวเสมือนจริง
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TicketIcon size={18} />
            </div>
            <span style={{ fontSize: '0.95rem' }}>รับบัตรคิวเสมือนจริงหน้าร้าน On-site</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ToyBoxIcon size={18} />
            </div>
            <span style={{ fontSize: '0.95rem' }}>แกะกล่องสุ่ม Art Toy สดๆ หน้าเคาน์เตอร์</span>
          </div>
        </div>
      </div>

      {/* Right Login Card (Mobile Hero + Form) */}
      <div className="login-card-wrapper">
        <div className="card" style={{ border: '2px solid var(--color-border)' }}>
          {/* Mobile Header Icon */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              className="brand-icon-box"
              style={{
                width: '56px',
                height: '56px',
                marginBottom: '12px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <ToyBoxIcon size={30} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--color-text)',
                textAlign: 'center',
              }}
            >
              เข้าสู่ระบบ PopQueue
            </h2>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-muted)',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              กรอกชื่อผู้ใช้เพื่อเริ่มรับบริการ Unboxing
            </p>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: '18px' }}>
              <ErrorAlert code={errorCode} message={errorMsg} />
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username-input" className="form-label">
                ชื่อผู้ใช้ (Username)
              </label>
              <input
                id="username-input"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                autoComplete="username"
                placeholder="เช่น collector1 หรือ staff_crybaby"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password-input" className="form-label">
                รหัสผ่าน (Password)
              </label>
              <input
                id="password-input"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                placeholder="รหัสผ่าน"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
