import { describe, it, expect } from 'vitest';
import { FakeClock, SystemClock, getQueueDate } from '../src/utils/clock.js';

describe('Clock and Timezone Utilities (NFR-09)', () => {
  it('FakeClock provides injectable and mutable time', () => {
    const baseTime = new Date('2026-11-01T10:00:00.000Z');
    const clock = new FakeClock(baseTime);

    expect(clock.now().toISOString()).toBe('2026-11-01T10:00:00.000Z');

    clock.advance(5 * 60 * 1000); // +5 minutes
    expect(clock.now().toISOString()).toBe('2026-11-01T10:05:00.000Z');

    const newTime = new Date('2026-11-02T00:00:00.000Z');
    clock.setTime(newTime);
    expect(clock.now().toISOString()).toBe('2026-11-02T00:00:00.000Z');
  });

  it('SystemClock returns a valid date close to system time', () => {
    const clock = new SystemClock();
    const now = clock.now();
    expect(now).toBeInstanceOf(Date);
    expect(Math.abs(Date.now() - now.getTime())).toBeLessThan(1000);
  });

  it('getQueueDate converts timestamps to Asia/Bangkok date string (UTC+7)', () => {
    // 2026-11-01 16:59:00 UTC = 2026-11-01 23:59:00 in Bangkok (UTC+7)
    const beforeMidnight = new Date('2026-11-01T16:59:00.000Z');
    expect(getQueueDate(beforeMidnight)).toBe('2026-11-01');

    // 2026-11-01 17:01:00 UTC = 2026-11-02 00:01:00 in Bangkok (UTC+7)
    const afterMidnight = new Date('2026-11-01T17:01:00.000Z');
    expect(getQueueDate(afterMidnight)).toBe('2026-11-02');
  });
});
