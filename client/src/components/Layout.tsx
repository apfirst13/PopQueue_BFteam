import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-brand">
          <h1>PopQueue</h1>
          <p>Art Toy Live Unboxing Queue Management System</p>
        </div>
        {user && (
          <div className="header-user">
            <span style={{ fontWeight: 600 }}>{user.fullName}</span>
            <span className="badge" style={{ backgroundColor: '#E2E8F0', color: '#334155' }}>
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ minHeight: '36px', padding: '4px 10px', fontSize: '0.85rem' }}
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
