import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { prisma } from '../../src/config/db.js';
import { app } from '../../src/app.js';
import { signTestToken, getAuthHeader } from '../helpers/auth-helper.js';
import { resetQueueState, createTicketFixture } from '../helpers/queue-helper.js';
import { Role, TicketStatus } from '@prisma/client';

describe('F-04 Ticket Detail: GET /api/tickets/:id (TEST-36)', () => {
  let collector1Token: string;
  let collector1User: { id: string };
  let staffCryUser: { id: string };
  let crySeries: { id: string; code: string; name: string };

  beforeAll(async () => {
    const c1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const series = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    collector1User = c1;
    staffCryUser = staffCry;
    crySeries = series;

    collector1Token = signTestToken(c1.id, Role.COLLECTOR, c1.tokenVersion);
  });

  beforeEach(async () => {
    await resetQueueState();
  });

  describe('TEST-36: Retrieve completed ticket results by owner (AC-36, FR-06)', () => {
    it('returns complete lifecycle details and timestamps in chronological order', async () => {
      const now = Date.now();
      const createdAt = new Date(now - 1000 * 60 * 10); // 10 mins ago
      const calledAt = new Date(now - 1000 * 60 * 5);   // 5 mins ago
      const startedAt = new Date(now - 1000 * 60 * 3);  // 3 mins ago
      const completedAt = new Date(now - 1000 * 60 * 1); // 1 min ago

      const ticket = await createTicketFixture({
        userId: collector1User.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.COMPLETED,
        createdAt,
        calledAt,
        startedAt,
        completedAt,
        handledByStaffId: staffCryUser.id,
      });

      const res = await request(app)
        .get(`/api/tickets/${ticket.id}`)
        .set(getAuthHeader(collector1Token));

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data).toMatchObject({
        id: ticket.id,
        displayNumber: 'CRY-001',
        status: 'COMPLETED',
        series: {
          id: crySeries.id,
          code: 'CRY',
          name: crySeries.name,
        },
      });

      // Timestamps must exist and be valid ISO strings
      const resCreatedAt = new Date(res.body.data.createdAt).getTime();
      const resCalledAt = new Date(res.body.data.calledAt).getTime();
      const resStartedAt = new Date(res.body.data.startedAt).getTime();
      const resCompletedAt = new Date(res.body.data.completedAt).getTime();

      expect(resCreatedAt).toBeLessThanOrEqual(resCalledAt);
      expect(resCalledAt).toBeLessThanOrEqual(resStartedAt);
      expect(resStartedAt).toBeLessThanOrEqual(resCompletedAt);

      // Collector inspection must not leak userFullName or other internal staff fields
      expect(res.body.data.userFullName).toBeUndefined();
    });
  });
});
