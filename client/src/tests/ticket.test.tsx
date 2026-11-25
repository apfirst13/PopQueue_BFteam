import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.js';
import { MyTicketPage } from '../pages/MyTicketPage.js';
import { SeriesPage } from '../pages/SeriesPage.js';

describe('MyTicketPage Component Tests (AC-19, AC-33, Master §4.3, §4.6)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('popqueue_token', 'valid-token');
    localStorage.setItem(
      'popqueue_user',
      JSON.stringify({ id: 'c1', username: 'collector1', fullName: 'Collector 1', role: 'COLLECTOR' }),
    );
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function renderTicket() {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/my-ticket']}>
          <Routes>
            <Route path="/my-ticket" element={<MyTicketPage />} />
            <Route path="/series" element={<SeriesPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it('shows empty state with link to /series when 404 NO_ACTIVE_TICKET is returned', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({
        error: { code: 'NO_ACTIVE_TICKET', message: 'No active ticket found' },
      }),
    } as Response);

    renderTicket();

    expect(await screen.findByRole('heading', { name: /ยังไม่มีบัตรคิว/i })).toBeInTheDocument();
    const seriesLink = screen.getByRole('link', { name: /เลือกซีรีส์|รับบัตรคิว/i });
    expect(seriesLink).toHaveAttribute('href', '/series');
  });

  it('renders active ticket: CRY-003, WAITING status, and เหลืออีก 2 คิวก่อนหน้า', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: {
            id: 't-3',
            displayNumber: 'CRY-003',
            queueNumber: 3,
            status: 'WAITING',
            waitingAhead: 2,
            series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
            createdAt: '2026-11-02T12:00:00.000Z',
            calledAt: null,
            startedAt: null,
          },
        },
      }),
    } as Response);

    renderTicket();

    expect(await screen.findByText(/CRY-003/i)).toBeInTheDocument();
    expect(screen.getByText(/WAITING/i)).toBeInTheDocument();
    expect(screen.getByText(/เหลืออีก 2 คิวก่อนหน้า/i)).toBeInTheDocument();
  });

  it('displays orange warning banner with ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์ and countdown when CALLED', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: {
            id: 't-3',
            displayNumber: 'CRY-003',
            queueNumber: 3,
            status: 'CALLED',
            waitingAhead: 0,
            series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
            createdAt: '2026-11-02T12:00:00.000Z',
            calledAt: '2026-11-02T12:05:00.000Z',
            startedAt: null,
          },
        },
      }),
    } as Response);

    renderTicket();

    expect(await screen.findByText(/ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์/i)).toBeInTheDocument();
    expect(screen.getByText(/CALLED/i)).toBeInTheDocument();
    // Countdown format 02:00 or similar
    expect(screen.getByText(/02:00|01:59/i)).toBeInTheDocument();
  });

  it('displays กำลังให้บริการ when status is UNBOXING', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: {
            id: 't-3',
            displayNumber: 'CRY-003',
            queueNumber: 3,
            status: 'UNBOXING',
            waitingAhead: 0,
            series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
            createdAt: '2026-11-02T12:00:00.000Z',
            calledAt: '2026-11-02T12:05:00.000Z',
            startedAt: '2026-11-02T12:07:00.000Z',
          },
        },
      }),
    } as Response);

    renderTicket();

    expect(await screen.findByText(/กำลังให้บริการ/i)).toBeInTheDocument();
    expect(screen.getByText('UNBOXING')).toBeInTheDocument();
  });

  it('displays retry button on error and re-fetches when clicked', async () => {
    const user = userEvent.setup();

    // 1. Initial fetch fails
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: { code: 'SERVER_ERROR', message: 'Internal Server Error' } }),
    } as Response);

    // 2. Retry fetch succeeds
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: {
            id: 't-3',
            displayNumber: 'CRY-003',
            queueNumber: 3,
            status: 'WAITING',
            waitingAhead: 1,
            series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
            createdAt: '2026-11-02T12:00:00.000Z',
            calledAt: null,
            startedAt: null,
          },
        },
      }),
    } as Response);

    renderTicket();

    const retryBtn = await screen.findByRole('button', { name: /ลองใหม่/i });
    await user.click(retryBtn);

    expect(await screen.findByText(/CRY-003/i)).toBeInTheDocument();
  });

  it('renders multiple active tickets ordered CRY CALLED + LAB WAITING with single page poller (BR-02 v2, AC-34)', async () => {
    const cryCalled = {
      id: 't-cry-1',
      displayNumber: 'CRY-001',
      queueNumber: 1,
      status: 'CALLED',
      waitingAhead: 0,
      series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
      createdAt: '2026-11-24T08:00:00.000Z',
      calledAt: '2026-11-24T08:02:00.000Z',
      startedAt: null,
    };
    const labWaiting = {
      id: 't-lab-2',
      displayNumber: 'LAB-002',
      queueNumber: 2,
      status: 'WAITING',
      waitingAhead: 1,
      series: { id: 's-lab', code: 'LAB', name: 'Labubu The Monsters' },
      createdAt: '2026-11-24T08:01:00.000Z',
      calledAt: null,
      startedAt: null,
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: cryCalled,
          tickets: [cryCalled, labWaiting],
        },
      }),
    } as Response);

    renderTicket();

    expect(await screen.findByText('CRY-001')).toBeInTheDocument();
    expect(screen.getByText('LAB-002')).toBeInTheDocument();
    expect(screen.getByText(/ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์/i)).toBeInTheDocument();
    expect(screen.getByText(/เหลืออีก 1 คิวก่อนหน้า/i)).toBeInTheDocument();

    const cards = document.querySelectorAll('.virtual-ticket-card');
    expect(cards).toHaveLength(2);
    expect(cards[0].getAttribute('data-series')).toBe('CRY');
    expect(cards[1].getAttribute('data-series')).toBe('LAB');
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it('maintains independent CountdownTimer instances per CALLED ticket across polls (BR-02 v2, TA Condition #4)', async () => {
    const cryCalled = {
      id: 't-cry-1',
      displayNumber: 'CRY-001',
      queueNumber: 1,
      status: 'CALLED',
      waitingAhead: 0,
      series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
      createdAt: '2026-11-24T08:00:00.000Z',
      calledAt: '2026-11-24T08:02:00.000Z',
      startedAt: null,
    };
    const labWaiting = {
      id: 't-lab-1',
      displayNumber: 'LAB-001',
      queueNumber: 1,
      status: 'WAITING',
      waitingAhead: 0,
      series: { id: 's-lab', code: 'LAB', name: 'Labubu The Monsters' },
      createdAt: '2026-11-24T08:01:00.000Z',
      calledAt: null,
      startedAt: null,
    };
    const labCalled = {
      ...labWaiting,
      status: 'CALLED',
      calledAt: '2026-11-24T08:02:03.000Z',
    };

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: { ticket: cryCalled, tickets: [cryCalled, labWaiting] },
        }),
      } as Response)
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: { ticket: cryCalled, tickets: [cryCalled, labCalled] },
        }),
      } as Response);

    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderTicket();

    expect(await screen.findByText('CRY-001')).toBeInTheDocument();
    expect(screen.getByText('02:00')).toBeInTheDocument();

    // Advance 3s: CRY countdown drops to 01:57 while single poller fetches LAB now in CALLED state (02:00)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3100);
    });

    const cryCard = document.querySelector('.virtual-ticket-card[data-series="CRY"]');
    const labCard = document.querySelector('.virtual-ticket-card[data-series="LAB"]');
    expect(cryCard?.textContent).toContain('01:57');
    expect(labCard?.textContent).toContain('02:00');
  });

  describe('TEST-41K (AC-41.10, AC-41.11, F-05): Queue Cancellation UI, Modal & Empty State', () => {
    it('shows cancel button only on WAITING tickets, opens modal with required confirmation text, and closes on dismiss', async () => {
      const user = userEvent.setup();
      const cryWaiting = {
        id: 't-cry-3',
        displayNumber: 'CRY-003',
        queueNumber: 3,
        status: 'WAITING',
        waitingAhead: 2,
        series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
        createdAt: '2026-11-25T10:00:00.000Z',
        calledAt: null,
        startedAt: null,
      };
      const labCalled = {
        id: 't-lab-1',
        displayNumber: 'LAB-001',
        queueNumber: 1,
        status: 'CALLED',
        waitingAhead: 0,
        series: { id: 's-lab', code: 'LAB', name: 'Labubu Macaron' },
        createdAt: '2026-11-25T10:01:00.000Z',
        calledAt: '2026-11-25T10:02:00.000Z',
        startedAt: null,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: { ticket: cryWaiting, tickets: [cryWaiting, labCalled] },
        }),
      } as Response);

      renderTicket();

      expect(await screen.findByText('CRY-003')).toBeInTheDocument();
      const cancelButtons = screen.getAllByRole('button', { name: /ยกเลิกคิว/i });
      expect(cancelButtons).toHaveLength(1);

      await user.click(cancelButtons[0]);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveTextContent(
        'ต้องการยกเลิกคิว CRY-003 หรือไม่? เลขคิวนี้จะไม่สามารถนำกลับมาใช้ได้อีก',
      );

      // Dismiss modal without cancelling
      await user.click(screen.getByRole('button', { name: /เก็บคิวไว้|ไม่ยกเลิก|ปิด/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    });

    it('disables confirm button while cancelling (double-submit guard), shows green toast and clean empty state without red error alert', async () => {
      const user = userEvent.setup();
      const cryWaiting = {
        id: 't-cry-3',
        displayNumber: 'CRY-003',
        queueNumber: 3,
        status: 'WAITING',
        waitingAhead: 0,
        series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
        createdAt: '2026-11-25T10:00:00.000Z',
        calledAt: null,
        startedAt: null,
      };

      let resolveCancel!: (value: Response) => void;
      const cancelPromise = new Promise<Response>((resolve) => {
        resolveCancel = resolve;
      });

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: { ticket: cryWaiting, tickets: [cryWaiting] } }),
        } as Response)
        .mockReturnValueOnce(cancelPromise)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ error: { code: 'NO_ACTIVE_TICKET', message: 'No active ticket found' } }),
        } as Response);

      renderTicket();

      await user.click(await screen.findByRole('button', { name: /ยกเลิกคิว/i }));
      const confirmBtn = screen.getByRole('button', { name: /ยืนยันยกเลิกคิว/i });
      await user.click(confirmBtn);

      // Confirm button must be disabled during in-flight request (double-submit guard)
      expect(confirmBtn).toBeDisabled();

      await act(async () => {
        resolveCancel({
          ok: true,
          status: 200,
          json: async () => ({
            data: {
              id: 't-cry-3',
              seriesId: 's-cry',
              displayNumber: 'CRY-003',
              status: 'CANCELLED',
              forfeitedAt: '2026-11-25T10:05:00.000Z',
            },
          }),
        } as Response);
      });

      expect(await screen.findByText(/ยกเลิกคิวสำเร็จ/i)).toBeInTheDocument();
      expect(await screen.findByText(/ไม่มีคิวที่กำลังรอ/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /ยังไม่มีบัตรคิว/i })).toBeInTheDocument();
      expect(document.querySelector('.alert-error')).toBeNull();
    });

    it('re-enables button and displays error alert/toast when cancellation fails with HTTP 400/403/404 or network error', async () => {
      const user = userEvent.setup();
      const cryWaiting = {
        id: 't-cry-3',
        displayNumber: 'CRY-003',
        queueNumber: 3,
        status: 'WAITING',
        waitingAhead: 0,
        series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
        createdAt: '2026-11-25T10:00:00.000Z',
        calledAt: null,
        startedAt: null,
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: { ticket: cryWaiting, tickets: [cryWaiting] } }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({
            error: {
              code: 'INVALID_STATE_TRANSITION',
              message: 'Ticket is no longer WAITING',
              statusCode: 400,
            },
          }),
        } as Response)
        .mockRejectedValueOnce(new TypeError('Network failure'));

      renderTicket();

      await user.click(await screen.findByRole('button', { name: /ยกเลิกคิว/i }));
      const confirmBtn = screen.getByRole('button', { name: /ยืนยันยกเลิกคิว/i });

      // 1. HTTP 400 rejection re-enables confirm button and displays error alert
      await user.click(confirmBtn);
      const alertBox = await screen.findByRole('alert');
      expect(alertBox).toHaveTextContent(/INVALID_STATE_TRANSITION/i);
      expect(confirmBtn).not.toBeDisabled();

      // 2. Network error retry also re-enables button and displays error alert
      await user.click(confirmBtn);
      expect(await screen.findByRole('alert')).toBeInTheDocument();
      expect(confirmBtn).not.toBeDisabled();
    });
  });

  describe('TEST-43J (AC-43.9, F-06, LIM-01): Collector Server-Synced Countdown Across Refresh', () => {
    it('syncs countdown from calledAt and serverNow without resetting to 02:00 on remount/refresh', async () => {
      const cryCalled = {
        id: 't-cry-1',
        displayNumber: 'CRY-001',
        queueNumber: 1,
        status: 'CALLED',
        waitingAhead: 0,
        series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
        createdAt: '2026-11-25T09:58:00.000Z',
        calledAt: '2026-11-25T10:00:00.000Z',
        startedAt: null,
      };

      // 1. Initial mount at +45s elapsed -> should show 01:15 (75s remaining)
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            ticket: cryCalled,
            tickets: [cryCalled],
            serverNow: '2026-11-25T10:00:45.000Z',
          },
        }),
      } as Response);

      const firstRender = renderTicket();
      expect(await screen.findByText('01:15')).toBeInTheDocument();
      firstRender.unmount();

      // 2. Remount / browser refresh 5s later (+50s elapsed) -> should show 01:10 (never reset to 02:00)
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            ticket: cryCalled,
            tickets: [cryCalled],
            serverNow: '2026-11-25T10:00:50.000Z',
          },
        }),
      } as Response);

      renderTicket();
      expect(await screen.findByText('01:10')).toBeInTheDocument();
      expect(screen.queryByText('02:00')).not.toBeInTheDocument();
    });
  });
});
