import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.js';
import { BoardPage } from '../pages/BoardPage.js';

describe('BoardPage Component Tests (F-07, AC-44.5, AC-44.8)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function renderBoard() {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/board']}>
          <Routes>
            <Route path="/board" element={<BoardPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it('renders Now Serving, Up Next, open empty series (- / ไม่มีคิวรอในขณะนี้), and closed series badge (ปิดรับคิวใหม่)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          timestamp: '2026-11-25T12:00:00.000Z',
          boards: [
            {
              seriesCode: 'CRY',
              seriesName: 'Crybaby Sunset Concert',
              isActive: true,
              nowServing: [{ displayNumber: 'CRY-003', status: 'UNBOXING' }],
              upNext: [
                { queueNumber: 4, displayNumber: 'CRY-004' },
                { queueNumber: 5, displayNumber: 'CRY-005' },
              ],
              waitingCount: 8,
            },
            {
              seriesCode: 'LAB',
              seriesName: 'Labubu Macaron',
              isActive: true,
              nowServing: [],
              upNext: [],
              waitingCount: 0,
            },
            {
              seriesCode: 'SKP',
              seriesName: 'Skullpanda Closed Demo',
              isActive: false,
              nowServing: [],
              upNext: [{ queueNumber: 1, displayNumber: 'SKP-001' }],
              waitingCount: 1,
            },
          ],
        },
      }),
    } as Response);

    renderBoard();

    expect(await screen.findByText(/Crybaby Sunset Concert/i)).toBeInTheDocument();
    const cryCard = screen.getByLabelText(/Crybaby Sunset Concert queue board/i);
    expect(within(cryCard).getByText('CRY-003')).toBeInTheDocument();
    expect(within(cryCard).getByText('CRY-004')).toBeInTheDocument();
    expect(within(cryCard).getByText('CRY-005')).toBeInTheDocument();
    expect(within(cryCard).getByText('8')).toBeInTheDocument();

    // Open series with zero queue shows '-' and 'ไม่มีคิวรอในขณะนี้'
    const labCard = screen.getByLabelText(/Labubu Macaron queue board/i);
    expect(within(labCard).getByText('-')).toBeInTheDocument();
    expect(within(labCard).getByText(/ไม่มีคิวรอในขณะนี้/i)).toBeInTheDocument();

    // Closed series with active ticket shows 'ปิดรับคิวใหม่'
    const skpCard = screen.getByLabelText(/Skullpanda Closed Demo queue board/i);
    expect(within(skpCard).getByText(/ปิดรับคิวใหม่/i)).toBeInTheDocument();

    // No login button should be shown on /board
    expect(screen.queryByRole('button', { name: /เข้าสู่ระบบ|login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /เข้าสู่ระบบ|login/i })).not.toBeInTheDocument();
  });

  it('polls every 3s, displays degraded connection banner on error, and recovers when API returns 200', async () => {
    vi.useFakeTimers();

    // 1st poll: initial success
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          timestamp: '2026-11-25T12:00:00.000Z',
          boards: [
            {
              seriesCode: 'CRY',
              seriesName: 'Crybaby Sunset Concert',
              isActive: true,
              nowServing: [],
              upNext: [{ queueNumber: 1, displayNumber: 'CRY-001' }],
              waitingCount: 1,
            },
          ],
        },
      }),
    } as Response);

    renderBoard();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText('CRY-001')).toBeInTheDocument();

    // 2nd poll (+3s): API error
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network down'));

    await act(async () => {
      vi.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText(/กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่/i)).toBeInTheDocument();
    // Preserves last known board data while degraded
    expect(screen.getByText('CRY-001')).toBeInTheDocument();

    // 3rd poll (+3s): API recovers with updated ticket
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          timestamp: '2026-11-25T12:00:06.000Z',
          boards: [
            {
              seriesCode: 'CRY',
              seriesName: 'Crybaby Sunset Concert',
              isActive: true,
              nowServing: [{ displayNumber: 'CRY-001', status: 'CALLED' }],
              upNext: [],
              waitingCount: 0,
            },
          ],
        },
      }),
    } as Response);

    await act(async () => {
      vi.advanceTimersByTime(3000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.queryByText(/กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่/i)).not.toBeInTheDocument();
    expect(screen.getByText('CRY-001')).toBeInTheDocument();
    expect(screen.getByText(/ไม่มีคิวรอในขณะนี้/i)).toBeInTheDocument();
  });
});
