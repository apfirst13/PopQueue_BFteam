import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.js';
import { Layout } from '../components/Layout.js';
import { ProtectedRoute } from '../components/ProtectedRoute.js';
import { LoginPage } from '../pages/LoginPage.js';
import { SeriesPage } from '../pages/SeriesPage.js';
import { MyTicketPage } from '../pages/MyTicketPage.js';
import { StaffCounterPage } from '../pages/StaffCounterPage.js';
import { ForbiddenPage } from '../pages/ForbiddenPage.js';
import { apiClient } from '../api/client.js';

describe('Authentication & Route Guard Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderWithRouter(initialEntry = '/login') {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/series"
                element={
                  <ProtectedRoute allowedRoles={['COLLECTOR']}>
                    <SeriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-ticket"
                element={
                  <ProtectedRoute allowedRoles={['COLLECTOR']}>
                    <MyTicketPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/counter"
                element={
                  <ProtectedRoute allowedRoles={['BOX_MASTER']}>
                    <StaffCounterPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/forbidden" element={<ForbiddenPage />} />
            </Routes>
          </Layout>
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it('renders login form with username, password, and sign in button', () => {
    renderWithRouter('/login');
    expect(screen.getByLabelText(/ชื่อผู้ใช้|username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/รหัสผ่าน|password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i })).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup();
    renderWithRouter('/login');

    const submitBtn = screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/กรุณากรอกชื่อผู้ใช้และรหัสผ่าน/i)).toBeInTheDocument();
  });

  it('displays Invalid username or password error on 401 INVALID_CREDENTIALS', async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' },
      }),
    } as Response);

    renderWithRouter('/login');

    await user.type(screen.getByLabelText(/ชื่อผู้ใช้|username/i), 'wronguser');
    await user.type(screen.getByLabelText(/รหัสผ่าน|password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i }));

    expect(await screen.findByText(/Invalid username or password/i)).toBeInTheDocument();
  });

  it('collector login without active ticket redirects to /series', async () => {
    const user = userEvent.setup();
    // 1. POST /api/auth/login
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          token: 'jwt-collector-token',
          user: { id: 'c1', username: 'collector1', fullName: 'Collector 1', role: 'COLLECTOR' },
        },
      }),
    } as Response);

    // 2. GET /api/tickets/my-ticket returns 404 NO_ACTIVE_TICKET
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        error: { code: 'NO_ACTIVE_TICKET', message: 'No active ticket' },
      }),
    } as Response);

    // 3. GET /api/series for /series page
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    } as Response);

    renderWithRouter('/login');

    await user.type(screen.getByLabelText(/ชื่อผู้ใช้|username/i), 'collector1');
    await user.type(screen.getByLabelText(/รหัสผ่าน|password/i), 'collector_dev_password123');
    await user.click(screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem('popqueue_token')).toBe('jwt-collector-token');
      expect(screen.getByText(/รายการซีรีส์|series/i)).toBeInTheDocument();
    });
  });

  it('collector login with active ticket redirects directly to /my-ticket', async () => {
    const user = userEvent.setup();
    // 1. POST /api/auth/login
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          token: 'jwt-collector-token',
          user: { id: 'c1', username: 'collector1', fullName: 'Collector 1', role: 'COLLECTOR' },
        },
      }),
    } as Response);

    // 2. GET /api/tickets/my-ticket returns 200 active ticket
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: {
            id: 't-123',
            displayNumber: 'CRY-001',
            queueNumber: 1,
            status: 'WAITING',
            waitingAhead: 0,
            series: { id: 's1', code: 'CRY', name: 'Crybaby Sunset' },
            createdAt: '2026-11-02T10:00:00.000Z',
            calledAt: null,
            startedAt: null,
          },
        },
      }),
    } as Response);

    renderWithRouter('/login');

    await user.type(screen.getByLabelText(/ชื่อผู้ใช้|username/i), 'collector1');
    await user.type(screen.getByLabelText(/รหัสผ่าน|password/i), 'collector_dev_password123');
    await user.click(screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/CRY-001/i)).toBeInTheDocument();
    });
  });

  it('box master login redirects to /staff/counter', async () => {
    const user = userEvent.setup();
    // 1. POST /api/auth/login
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          token: 'jwt-staff-token',
          user: { id: 's1', username: 'staff_crybaby', fullName: 'Staff Crybaby', role: 'BOX_MASTER' },
        },
      }),
    } as Response);

    // 2. GET /api/staff/tickets
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          series: [
            {
              seriesId: 's1',
              code: 'CRY',
              name: 'Crybaby',
              activeServing: null,
              waitingQueue: [],
            },
          ],
        },
      }),
    } as Response);

    renderWithRouter('/login');

    await user.type(screen.getByLabelText(/ชื่อผู้ใช้|username/i), 'staff_crybaby');
    await user.type(screen.getByLabelText(/รหัสผ่าน|password/i), 'staff_dev_password123');
    await user.click(screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/เคาน์เตอร์บริการ|staff counter/i)).toBeInTheDocument();
    });
  });

  it('route guard: unauthenticated access to /series redirects to /login', () => {
    renderWithRouter('/series');
    expect(screen.getByRole('button', { name: /เข้าสู่ระบบ|sign in/i })).toBeInTheDocument();
  });

  it('route guard: collector accessing /staff/counter redirects to /forbidden', () => {
    localStorage.setItem('popqueue_token', 'collector-token');
    localStorage.setItem(
      'popqueue_user',
      JSON.stringify({ id: 'c1', username: 'collector1', fullName: 'Collector 1', role: 'COLLECTOR' }),
    );

    renderWithRouter('/staff/counter');
    expect(screen.getByText(/403 - ไม่มีสิทธิ์เข้าถึง/i)).toBeInTheDocument();
  });

  it('route guard: box master accessing /series redirects to /forbidden', () => {
    localStorage.setItem('popqueue_token', 'staff-token');
    localStorage.setItem(
      'popqueue_user',
      JSON.stringify({ id: 's1', username: 'staff_crybaby', fullName: 'Staff Crybaby', role: 'BOX_MASTER' }),
    );

    renderWithRouter('/series');
    expect(screen.getByText(/403 - ไม่มีสิทธิ์เข้าถึง/i)).toBeInTheDocument();
  });

  it('apiClient: 401 UNAUTHENTICATED clears localStorage and redirects to /login', async () => {
    localStorage.setItem('popqueue_token', 'expired-token');
    localStorage.setItem(
      'popqueue_user',
      JSON.stringify({ id: 'c1', username: 'collector1', fullName: 'Collector 1', role: 'COLLECTOR' }),
    );

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: { code: 'UNAUTHENTICATED', message: 'Token expired' },
      }),
    } as Response);

    await expect(apiClient('/api/tickets/my-ticket')).rejects.toThrow();
    expect(localStorage.getItem('popqueue_token')).toBeNull();
    expect(localStorage.getItem('popqueue_user')).toBeNull();
  });
});
