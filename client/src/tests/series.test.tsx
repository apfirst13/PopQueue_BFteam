import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.js';
import { SeriesPage } from '../pages/SeriesPage.js';
import { MyTicketPage } from '../pages/MyTicketPage.js';

describe('SeriesPage Component Tests (AC-19, Master §2.6)', () => {
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
    vi.restoreAllMocks();
  });

  const mockSeriesList = [
    { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert', isActive: true, waitingCount: 3 },
    { id: 's-lab', code: 'LAB', name: 'Labubu Macaron', isActive: true, waitingCount: 0 },
    { id: 's-skp', code: 'SKP', name: 'Skullpanda Closed Demo', isActive: false, waitingCount: 0 },
  ];

  function renderSeries() {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/series']}>
          <Routes>
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/my-ticket" element={<MyTicketPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it('renders series list with codes, names, and waiting counts', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: mockSeriesList }),
    } as Response);

    renderSeries();

    expect(await screen.findByText(/Crybaby Sunset Concert/i)).toBeInTheDocument();
    expect(screen.getByText(/Labubu Macaron/i)).toBeInTheDocument();
    expect(screen.getByText(/Skullpanda Closed Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/3 คิวรอ/i)).toBeInTheDocument();
  });

  it('closed series shows ปิดรับคิว and button is disabled', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: mockSeriesList }),
    } as Response);

    renderSeries();

    const closedBadges = await screen.findAllByText(/ปิดรับคิว/i);
    expect(closedBadges.length).toBeGreaterThan(0);

    const joinButtons = screen.getAllByRole('button', { name: /เข้าคิว|join|ปิดรับคิว/i });
    // SKP button is disabled
    const skpButton = joinButtons.find(
      (btn) => btn.closest('[data-series="SKP"]') || btn.textContent?.includes('ปิดรับคิว'),
    );
    expect(skpButton).toBeDisabled();
  });

  it('join queue on CRY shows loading and navigates to /my-ticket on 201', async () => {
    const user = userEvent.setup();

    // 1. GET /api/series
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: mockSeriesList }),
    } as Response);

    // 2. POST /api/tickets/join
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        data: {
          ticketId: 't-new',
          displayNumber: 'CRY-004',
          queueNumber: 4,
          queueDate: '2026-11-02',
          status: 'WAITING',
          seriesName: 'Crybaby Sunset Concert',
          createdAt: '2026-11-02T12:00:00.000Z',
        },
      }),
    } as Response);

    // 3. GET /api/tickets/my-ticket for MyTicketPage
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          ticket: {
            id: 't-new',
            displayNumber: 'CRY-004',
            queueNumber: 4,
            status: 'WAITING',
            waitingAhead: 3,
            series: { id: 's-cry', code: 'CRY', name: 'Crybaby Sunset Concert' },
            createdAt: '2026-11-02T12:00:00.000Z',
            calledAt: null,
            startedAt: null,
          },
        },
      }),
    } as Response);

    renderSeries();

    await screen.findByText(/Crybaby Sunset Concert/i);

    const cryCard = screen.getByText(/Crybaby Sunset Concert/i).closest('.card');
    const joinBtn = cryCard?.querySelector('button') as HTMLButtonElement;
    expect(joinBtn).toBeEnabled();

    await user.click(joinBtn);

    await waitFor(() => {
      expect(screen.getByText(/CRY-004/i)).toBeInTheDocument();
    });
  });

  it('shows error banner when join returns 409 DUPLICATE_ACTIVE_QUEUE', async () => {
    const user = userEvent.setup();

    // 1. GET /api/series
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: mockSeriesList }),
    } as Response);

    // 2. POST /api/tickets/join returns 409
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: {
          code: 'DUPLICATE_ACTIVE_QUEUE',
          message: 'User already has an active queue ticket',
        },
      }),
    } as Response);

    renderSeries();

    await screen.findByText(/Crybaby Sunset Concert/i);

    const cryCard = screen.getByText(/Crybaby Sunset Concert/i).closest('.card');
    const joinBtn = cryCard?.querySelector('button') as HTMLButtonElement;

    await user.click(joinBtn);

    expect(await screen.findByText(/DUPLICATE_ACTIVE_QUEUE/i)).toBeInTheDocument();
  });

  it('shows empty state when series list is empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    } as Response);

    renderSeries();

    expect(
      await screen.findByText(/ไม่มีรายการซีรีส์เปิดให้บริการในขณะนี้/i),
    ).toBeInTheDocument();
  });
});
