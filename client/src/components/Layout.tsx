import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ToyBoxIcon,
  LogOutIcon,
  GridIcon,
  TicketIcon,
} from './icons.js';

export function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const commitSha = (import.meta.env && import.meta.env.VITE_GIT_SHA) || 'dev';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isCollector = user && user.role === 'COLLECTOR';
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="app-container">
      <div className="header-wrapper">
        <header className="header">
          <div className="header-brand">
            <div className="brand-icon-box" aria-hidden="true">
              <ToyBoxIcon size={22} />
            </div>
            <div>
              <h1>PopQueue</h1>
              <p>Art Toy Live Unboxing Queue Management System</p>
            </div>
          </div>

          {/* Collector Top Navigation on Tablet & Desktop */}
          {isCollector && (
            <nav className="header-nav" aria-label="แถบนำทางหลัก">
              <Link
                to="/series"
                className={`nav-link ${location.pathname === '/series' ? 'active' : ''}`}
              >
                <GridIcon size={18} />
                <span>ดูซีรีส์</span>
              </Link>
              <Link
                to="/my-ticket"
                className={`nav-link ${location.pathname === '/my-ticket' ? 'active' : ''}`}
              >
                <TicketIcon size={18} />
                <span>บัตรคิวของฉัน</span>
              </Link>
            </nav>
          )}

          {user && (
            <div className="header-user">
              <div className="user-avatar-initial" title={user.fullName}>
                {initial}
              </div>
              <span className="user-name-text">{user.fullName}</span>
              <span
                className="badge"
                style={{
                  backgroundColor: user.role === 'BOX_MASTER' ? '#FFE4EC' : '#EFF6FF',
                  color: user.role === 'BOX_MASTER' ? '#BE123C' : '#1D4ED8',
                  border: '1px solid currentColor',
                }}
              >
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{
                  minHeight: '40px',
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                }}
                aria-label="ออกจากระบบ"
              >
                <LogOutIcon size={16} />
                <span className="user-name-text">ออกจากระบบ</span>
              </button>
            </div>
          )}
        </header>
      </div>

      <main className="main-content">{children}</main>

      <footer
        className="footer"
        style={{
          textAlign: 'center',
          padding: '16px 12px 24px',
          fontSize: '0.75rem',
          color: '#64748B',
        }}
      >
        <span>PopQueue v0.2.0-lab5</span>
        <span style={{ margin: '0 8px' }}>•</span>
        <span>
          Commit:{' '}
          <code
            data-testid="git-sha-badge"
            title={commitSha}
            style={{
              padding: '2px 6px',
              backgroundColor: '#F1F5F9',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          >
            {commitSha.length > 7 ? commitSha.substring(0, 7) : commitSha}
          </code>
        </span>
      </footer>

      {/* Collector Mobile Floating Bottom Navigation */}
      {isCollector && (
        <nav className="bottom-nav" aria-label="แถบนำทางด้านล่าง">
          <Link
            to="/series"
            className={`bottom-nav-item ${location.pathname === '/series' ? 'active' : ''}`}
          >
            <GridIcon size={20} />
            <span>ดูซีรีส์</span>
          </Link>
          <Link
            to="/my-ticket"
            className={`bottom-nav-item ${location.pathname === '/my-ticket' ? 'active' : ''}`}
          >
            <TicketIcon size={20} />
            <span>บัตรคิวของฉัน</span>
          </Link>
        </nav>
      )}
    </div>
  );
}

export default Layout;
