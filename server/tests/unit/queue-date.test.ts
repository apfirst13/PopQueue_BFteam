import { describe, it, expect } from 'vitest';
import { getQueueDate, getQueueDateAsDate } from '../../src/utils/clock.js';

describe('Unit: Queue Date Bangkok Timezone Rollover Characterization (TEST-17U, AC-17, BR-01, A-01)', () => {
  it('TEST-17U: getQueueDate correctly resolves 16:59:59Z and 17:00:00Z as consecutive Bangkok dates', () => {
    // 2026-11-08 16:59:59 UTC = 2026-11-08 23:59:59 in Asia/Bangkok (UTC+7)
    const beforeMidnightUTC = new Date('2026-11-08T16:59:59.000Z');
    expect(getQueueDate(beforeMidnightUTC)).toBe('2026-11-08');

    // 2026-11-08 17:00:00 UTC = 2026-11-09 00:00:00 in Asia/Bangkok (UTC+7)
    const midnightUTC = new Date('2026-11-08T17:00:00.000Z');
    expect(getQueueDate(midnightUTC)).toBe('2026-11-09');

    // Verify date normalization for DB @db.Date field
    const dateObj = getQueueDateAsDate(midnightUTC);
    expect(dateObj).toBeInstanceOf(Date);
    expect(dateObj.toISOString()).toBe('2026-11-09T00:00:00.000Z');
  });
});
