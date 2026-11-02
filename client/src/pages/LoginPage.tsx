import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import * as ticketApi from '../api/ticket.api.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { ApiError } from '../api/client.js';

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
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto 0' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', textAlign: 'center' }}>
        เข้าสู่ระบบ PopQueue
      </h2>

      {errorMsg && (
        <div style={{ marginBottom: '16px' }}>
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
          style={{ width: '100%', marginTop: '8px' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
