import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePolling } from '../hooks/usePolling.js';

describe('usePolling Hook Unit Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('calls callback every intervalMs (3000ms)', () => {
    const callback = vi.fn();
    renderHook(() => usePolling(callback, 3000));

    expect(callback).not.toHaveBeenCalled();

    // Advance 3000ms
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance another 3000ms
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(2);

    // Advance another 3000ms
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('cleans up interval on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => usePolling(callback, 3000));

    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    vi.advanceTimersByTime(6000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not poll when enabled is false', () => {
    const callback = vi.fn();
    renderHook(() => usePolling(callback, 3000, false));

    vi.advanceTimersByTime(9000);
    expect(callback).not.toHaveBeenCalled();
  });
});
