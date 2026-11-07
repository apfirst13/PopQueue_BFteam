import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';
import { FakeClock } from '../../src/utils/clock.js';

describe('Integration: Midnight Queue Date Rollover (TEST-17, AC-17, BR-01, A-01)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-17: resets daily queue counter to 1 when time crosses midnight Bangkok time', async () => {
    // 1. Arrange: Initialize FakeClock at 23:59:59 Bangkok time (16:59:59 UTC)
    const beforeMidnight = new Date('2026-11-08T16:59:59.000Z');
    const fakeClock = new FakeClock(beforeMidnight);

    // Create app instance with injected FakeClock
    const appWithFakeClock = createApp({ clock: fakeClock });

    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const token1 = signTestToken(collector1.id, collector1.role, collector1.tokenVersion);
    const token2 = signTestToken(collector2.id, collector2.role, collector2.tokenVersion);

    // 2. Act 1: Collector 1 joins right before midnight
    const res1 = await request(appWithFakeClock)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token1}`)
      .send({ seriesId: crySeries.id });

    expect(res1.status).toBe(201);
    expect(res1.body.data.displayNumber).toBe('CRY-001');
    expect(res1.body.data.queueNumber).toBe(1);
    expect(res1.body.data.queueDate).toBe('2026-11-08');

    // 3. Advance clock by 2 seconds -> crosses midnight into 00:00:01 of 2026-11-09 Bangkok time
    fakeClock.advance(2000); // 17:00:01 UTC = 00:00:01 Bangkok

    // 4. Act 2: Collector 2 joins right after midnight on the new day
    const res2 = await request(appWithFakeClock)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token2}`)
      .send({ seriesId: crySeries.id });

    expect(res2.status).toBe(201);
    // Crucial: Queue counter MUST reset to 1 on the new queueDate
    expect(res2.body.data.displayNumber).toBe('CRY-001');
    expect(res2.body.data.queueNumber).toBe(1);
    expect(res2.body.data.queueDate).toBe('2026-11-09');

    // Verify both tickets exist independently in DB under their respective dates
    const tickets = await prisma.queueTicket.findMany({
      where: { seriesId: crySeries.id },
      orderBy: { queueDate: 'asc' },
    });
    expect(tickets.length).toBe(2);
    expect(tickets[0].queueDate.toISOString().split('T')[0]).toBe('2026-11-08');
    expect(tickets[1].queueDate.toISOString().split('T')[0]).toBe('2026-11-09');
  });
});
