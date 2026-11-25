import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const mockStaffData: StaffTicketsResponse = {
    data: {
      series: [
        {
          seriesId: 's-cry',
          code: 'CRY',
          name: 'Crybaby Sunset Concert',
          isActive: true,
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
          isActive: true,
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
            isActive: true,
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
            isActive: true,
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

  describe('TEST-43I (AC-43.8, F-06): Staff Console 120s No-Show Countdown & Confirmation Flow', () => {
    it('disables No-Show button with countdown before 120s, enables at >=120s, and confirms No-Show with toast', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      const calledAt = '2026-11-25T10:00:00.000Z';
      const initialServerNow = '2026-11-25T10:01:58.000Z'; // 118s elapsed -> 2s remaining
      const afterTwoSecServerNow = '2026-11-25T10:02:00.000Z';

      const calledPayload = {
        data: {
          serverNow: initialServerNow,
          series: [
            {
              seriesId: 's-cry',
              code: 'CRY',
              name: 'Crybaby Sunset Concert',
              activeServing: {
                id: 't-cry-1',
                displayNumber: 'CRY-001',
                status: 'CALLED',
                calledAt,
                startedAt: null,
              },
              waitingQueue: [],
            },
          ],
        },
      };

      const afterNoShowPayload = {
        data: {
          serverNow: afterTwoSecServerNow,
          series: [
            {
              seriesId: 's-cry',
              code: 'CRY',
              name: 'Crybaby Sunset Concert',
              activeServing: null,
              waitingQueue: [],
            },
          ],
        },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => calledPayload,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              id: 't-cry-1',
              displayNumber: 'CRY-001',
              status: 'NO_SHOW',
              forfeitedAt: afterTwoSecServerNow,
            },
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => afterNoShowPayload,
        } as Response);

      renderStaff();

      const waitingNoShowBtn = await screen.findByRole('button', { name: /รออีก 2 วินาที|ตัดสิทธิ์ No-Show/i });
      expect(waitingNoShowBtn).toBeDisabled();
      expect(waitingNoShowBtn).toHaveTextContent(/รออีก 2 วินาที/);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(2100);
      });

      const readyNoShowBtn = screen.getByRole('button', { name: /ตัดสิทธิ์ No-Show/i });
      expect(readyNoShowBtn).toBeEnabled();
      expect(readyNoShowBtn).toHaveTextContent('ตัดสิทธิ์ No-Show');

      await user.click(readyNoShowBtn);

      const dialog = await screen.findByRole('dialog');
      expect(dialog).toHaveTextContent(/CRY-001/);

      const confirmBtn = screen.getByRole('button', { name: /ยืนยันตัดสิทธิ์ No-Show/i });
      await user.click(confirmBtn);

      expect(await screen.findByText(/ตัดสิทธิ์ No-Show คิว CRY-001 สำเร็จ/i)).toBeInTheDocument();
      const callNextBtn = screen.getByRole('button', { name: /เรียกคิวถัดไป|call next/i });
      expect(callNextBtn).toBeEnabled();
    });
  });

  describe('F-09 (AC-46.1..46.5): Series Availability Toggle Switch UI States', () => {
    it('toggles series off with loading/disabled state, toast, closed badge, while keeping Call Next active for queued tickets', async () => {
      const user = userEvent.setup();

      const openCryPayload = {
        data: {
          serverNow: '2026-11-25T10:00:00.000Z',
          series: [
            {
              seriesId: 's-cry',
              code: 'CRY',
              name: 'Crybaby Sunset Concert',
              isActive: true,
              activeServing: null,
              waitingQueue: [
                {
                  id: 't-1',
                  displayNumber: 'CRY-001',
                  queueNumber: 1,
                  createdAt: '2026-11-25T09:50:00.000Z',
                  userFullName: 'Collector 1',
                },
              ],
            },
          ],
        },
      };

      const closedCryPayload = {
        data: {
          serverNow: '2026-11-25T10:00:05.000Z',
          series: [
            {
              ...openCryPayload.data.series[0],
              isActive: false,
            },
          ],
        },
      };

      let resolveToggle!: (value: Response) => void;
      const pendingTogglePromise = new Promise<Response>((resolve) => {
        resolveToggle = resolve;
      });

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => openCryPayload,
        } as Response)
        .mockReturnValueOnce(pendingTogglePromise)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => closedCryPayload,
        } as Response);

      renderStaff();

      const toggleSwitch = await screen.findByRole('switch', { name: /เปิด-ปิดรับคิวซีรีส์ CRY/i });
      expect(toggleSwitch).toBeChecked();
      expect(toggleSwitch).toBeEnabled();
      expect(screen.getByText('เปิดรับคิว')).toBeInTheDocument();

      await user.click(toggleSwitch);

      // While request is in flight: disabled to guard against double click and displays loading indicator
      expect(toggleSwitch).toBeDisabled();
      expect(screen.getByText(/กำลังอัปเดต|กำลังบันทึก/i)).toBeInTheDocument();

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/staff\/series\/s-cry\/status$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ isActive: false }),
        }),
      );

      await act(async () => {
        resolveToggle({
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              id: 's-cry',
              code: 'CRY',
              name: 'Crybaby Sunset Concert',
              isActive: false,
            },
          }),
        } as Response);
      });

      expect(await screen.findByText(/ปิดรับคิวเรียบร้อย/i)).toBeInTheDocument();
      const updatedSwitch = screen.getByRole('switch', { name: /เปิด-ปิดรับคิวซีรีส์ CRY/i });
      expect(updatedSwitch).not.toBeChecked();
      expect(updatedSwitch).toBeEnabled();
      expect(screen.getByText('ปิดรับคิว')).toBeInTheDocument();

      // Existing queued tickets can still be called (AC-46.4)
      expect(screen.getByRole('button', { name: /เรียกคิวถัดไป|call next/i })).toBeEnabled();
    });

    it('reverts switch state and displays error notification when PATCH fails with 403 FORBIDDEN_SERIES, then allows re-open', async () => {
      const user = userEvent.setup();

      const closedCryPayload = {
        data: {
          serverNow: '2026-11-25T10:00:00.000Z',
          series: [
            {
              seriesId: 's-cry',
              code: 'CRY',
              name: 'Crybaby Sunset Concert',
              isActive: false,
              activeServing: null,
              waitingQueue: [],
            },
          ],
        },
      };

      const reopenedCryPayload = {
        data: {
          serverNow: '2026-11-25T10:00:10.000Z',
          series: [
            {
              ...closedCryPayload.data.series[0],
              isActive: true,
            },
          ],
        },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => closedCryPayload,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          json: async () => ({
            error: {
              code: 'FORBIDDEN_SERIES',
              message: 'Staff is not assigned to this series',
              statusCode: 403,
            },
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              id: 's-cry',
              code: 'CRY',
              name: 'Crybaby Sunset Concert',
              isActive: true,
            },
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => reopenedCryPayload,
        } as Response);

      renderStaff();

      const toggleSwitch = await screen.findByRole('switch', { name: /เปิด-ปิดรับคิวซีรีส์ CRY/i });
      expect(toggleSwitch).not.toBeChecked();
      expect(screen.getByText('ปิดรับคิว')).toBeInTheDocument();

      // 1) Click to open -> receives 403 FORBIDDEN_SERIES -> must revert to unchecked
      await user.click(toggleSwitch);

      expect(await screen.findByText(/FORBIDDEN_SERIES/i)).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /เปิด-ปิดรับคิวซีรีส์ CRY/i })).not.toBeChecked();
      expect(screen.getByText('ปิดรับคิว')).toBeInTheDocument();

      // 2) Retry toggle -> succeeds -> switch checked + "เปิดรับคิวสำเร็จ"
      await user.click(screen.getByRole('switch', { name: /เปิด-ปิดรับคิวซีรีส์ CRY/i }));

      expect(await screen.findByText(/เปิดรับคิวสำเร็จ/i)).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /เปิด-ปิดรับคิวซีรีส์ CRY/i })).toBeChecked();
      expect(screen.getByText('เปิดรับคิว')).toBeInTheDocument();
    });
  });
});
