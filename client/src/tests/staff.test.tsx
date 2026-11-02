import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.js';
import { StaffCounterPage } from '../pages/StaffCounterPage.js';
import { StaffTicketsResponse } from '../types/index.js';

describe('StaffCounterPage Component Tests (Master §3.6)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('popqueue_token', 'valid-staff-token');
    localStorage.setItem(
      'popqueue_user',
      JSON.stringify({ id: 's1', username: 'staff_crybaby', fullName: 'Staff Crybaby', role: 'BOX_MASTER' }),
    );
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockStaffData: StaffTicketsResponse = {
    data: {
      series: [
        {
          seriesId: 's-cry',
          code: 'CRY',
          name: 'Crybaby Sunset Concert',
          activeServing: null,
          waitingQueue: [
            {
              id: 't-1',
              displayNumber: 'CRY-001',
              queueNumber: 1,
              createdAt: '2026-11-02T10:00:00.000Z',
              userFullName: 'Collector 1',
            },
            {
              id: 't-2',
              displayNumber: 'CRY-002',
              queueNumber: 2,
              createdAt: '2026-11-02T10:05:00.000Z',
              userFullName: 'Collector 2',
            },
          ],
        },
        {
          seriesId: 's-lab',
          code: 'LAB',
          name: 'Labubu Macaron',
          activeServing: null,
          waitingQueue: [],
        },
      ],
    },
  };

  function renderStaff() {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/staff/counter']}>
          <Routes>
            <Route path="/staff/counter" element={<StaffCounterPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it('renders series selector when staff is assigned multiple series', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockStaffData,
    } as Response);

    renderStaff();

    expect(await screen.findByRole('combobox', { name: /เลือกซีรีส์/i })).toBeInTheDocument();
    expect(screen.getByText(/CRY - Crybaby/i)).toBeInTheDocument();
  });

  it('displays waiting queue with queue numbers and customer full names', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockStaffData,
    } as Response);

    renderStaff();

    expect(await screen.findByText(/CRY-001/i)).toBeInTheDocument();
    expect(screen.getByText(/Collector 1/i)).toBeInTheDocument();
    expect(screen.getByText(/CRY-002/i)).toBeInTheDocument();
    expect(screen.getByText(/Collector 2/i)).toBeInTheDocument();
  });

  it('shows ยังไม่มีคิวรอรับบริการ when waiting queue is empty', async () => {
    const emptyData: StaffTicketsResponse = {
      data: {
        series: [
          {
            seriesId: 's-cry',
            code: 'CRY',
            name: 'Crybaby',
            activeServing: null,
            waitingQueue: [],
          },
        ],
      },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => emptyData,
    } as Response);

    renderStaff();

    expect(await screen.findByText(/ยังไม่มีคิวรอรับบริการ/i)).toBeInTheDocument();
  });

  it('call next button sends seriesId and transitions to CALLED', async () => {
    const user = userEvent.setup();

    // 1. Initial GET
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockStaffData,
    } as Response);

    // 2. POST /api/staff/call-next
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticketId: 't-1',
          displayNumber: 'CRY-001',
          status: 'CALLED',
          handledByStaffId: 's1',
          calledAt: '2026-11-02T10:10:00.000Z',
        },
      }),
    } as Response);

    // 3. Refetched GET
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          series: [
            {
              ...mockStaffData.data.series[0],
              activeServing: {
                id: 't-1',
                displayNumber: 'CRY-001',
                status: 'CALLED',
                calledAt: '2026-11-02T10:10:00.000Z',
                startedAt: null,
              },
              waitingQueue: [mockStaffData.data.series[0].waitingQueue[1]],
            },
          ],
        },
      }),
    } as Response);

    renderStaff();

    const callNextBtn = await screen.findByRole('button', { name: /เรียกคิวถัดไป|call next/i });
    expect(callNextBtn).toBeEnabled();

    await user.click(callNextBtn);

    await waitFor(() => {
      // Button for Verify & Start Unboxing should now appear
      expect(screen.getByRole('button', { name: /verify & start|เริ่มเปิดกล่อง/i })).toBeInTheDocument();
    });
  });

  it('verify & start unboxing button calls API and complete button appears', async () => {
    const user = userEvent.setup();

    const calledData: StaffTicketsResponse = {
      data: {
        series: [
          {
            seriesId: 's-cry',
            code: 'CRY',
            name: 'Crybaby',
            activeServing: {
              id: 't-1',
              displayNumber: 'CRY-001',
              status: 'CALLED',
              calledAt: '2026-11-02T10:10:00.000Z',
              startedAt: null,
            },
            waitingQueue: [],
          },
        ],
      },
    };

    // 1. Initial GET
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => calledData,
    } as Response);

    // 2. POST /api/staff/tickets/:id/start-unboxing
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticketId: 't-1',
          status: 'UNBOXING',
          startedAt: '2026-11-02T10:12:00.000Z',
        },
      }),
    } as Response);

    // 3. Refetched GET
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          series: [
            {
              ...calledData.data.series[0],
              activeServing: {
                id: 't-1',
                displayNumber: 'CRY-001',
                status: 'UNBOXING',
                calledAt: '2026-11-02T10:10:00.000Z',
                startedAt: '2026-11-02T10:12:00.000Z',
              },
            },
          ],
        },
      }),
    } as Response);

    renderStaff();

    const startBtn = await screen.findByRole('button', { name: /verify & start|เริ่มเปิดกล่อง/i });
    await user.click(startBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /เสร็จสิ้น|complete/i })).toBeInTheDocument();
    });
  });

  it('displays error banner when call-next fails with STAFF_BUSY', async () => {
    const user = userEvent.setup();

    // 1. Initial GET
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockStaffData,
    } as Response);

    // 2. POST /call-next returns 409 STAFF_BUSY
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: { code: 'STAFF_BUSY', message: 'Staff currently has an active ticket' },
      }),
    } as Response);

    renderStaff();

    const callNextBtn = await screen.findByRole('button', { name: /เรียกคิวถัดไป|call next/i });
    await user.click(callNextBtn);

    expect(await screen.findByText(/STAFF_BUSY/i)).toBeInTheDocument();
  });
});
