import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { prisma } from '../../src/config/db.js';
import { app } from '../../src/app.js';
import { signTestToken, getAuthHeader } from '../helpers/auth-helper.js';
import { resetQueueState, createTicketFixture, transitionTicketToCalled } from '../helpers/queue-helper.js';
import { Role, TicketStatus } from '@prisma/client';

describe('F-04 Ticket Inspection: GET /api/tickets/my-ticket (TEST-34, TEST-35)', () => {
  let collector1Token: string;
  let collector4Token: string;
  let staffCryToken: string;

  let collector1User: { id: string };
  let collector2User: { id: string };
  let collector3User: { id: string };
  let staffCryUser: { id: string };
  let crySeries: { id: string; code: string; name: string };

  beforeAll(async () => {
    const c1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const c2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const c3 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector3' } });
    const c4 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector4' } });
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const series = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    collector1User = c1;
    collector2User = c2;
    collector3User = c3;
    staffCryUser = staffCry;
    crySeries = series;

    collector1Token = signTestToken(c1.id, Role.COLLECTOR, c1.tokenVersion);
    collector4Token = signTestToken(c4.id, Role.COLLECTOR, c4.tokenVersion);
    staffCryToken = signTestToken(staffCry.id, Role.BOX_MASTER, staffCry.tokenVersion);
  });

  beforeEach(async () => {
    await resetQueueState();
  });

  describe('TEST-34: Active ticket inspection & queue progress (AC-34, FR-05)', () => {
    it('returns active ticket with correct waitingAhead and transitions to CALLED with timestamps', async () => {
      const today = new Date();

      // Seed CRY-001 (collector2) and CRY-002 (collector3) ahead of collector1
      await createTicketFixture({
        userId: collector2User.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.WAITING,
        queueDate: today,
      });

      await createTicketFixture({
        userId: collector3User.id,
        seriesId: crySeries.id,
        queueNumber: 2,
        displayNumber: 'CRY-002',
        status: TicketStatus.WAITING,
        queueDate: today,
      });

      // Collector1 holds CRY-003
      const ticket3 = await createTicketFixture({
        userId: collector1User.id,
        seriesId: crySeries.id,
        queueNumber: 3,
        displayNumber: 'CRY-003',
        status: TicketStatus.WAITING,
        queueDate: today,
      });

      // 1. Initial inspection: collector1 has waitingAhead = 2
      const res1 = await request(app)
        .get('/api/tickets/my-ticket')
        .set(getAuthHeader(collector1Token));

      expect(res1.status).toBe(200);
      expect(res1.body.data).toBeDefined();
      expect(res1.body.data.ticket).toMatchObject({
        id: ticket3.id,
        displayNumber: 'CRY-003',
        queueNumber: 3,
        status: 'WAITING',
        waitingAhead: 2,
        series: {
          id: crySeries.id,
          code: 'CRY',
          name: crySeries.name,
        },
        calledAt: null,
        startedAt: null,
      });
      expect(typeof res1.body.data.ticket.createdAt).toBe('string');

      // 2. Complete 001 and 002, then transition 003 to CALLED by staff_crybaby
      await prisma.queueTicket.updateMany({
        where: { displayNumber: { in: ['CRY-001', 'CRY-002'] } },
        data: { status: TicketStatus.COMPLETED, completedAt: new Date() },
      });

      const calledTime = new Date();
      await transitionTicketToCalled(ticket3.id, staffCryUser.id, calledTime);

      // 3. Second inspection: collector1 is now CALLED -> waitingAhead = 0, calledAt populated
      const res2 = await request(app)
        .get('/api/tickets/my-ticket')
        .set(getAuthHeader(collector1Token));

      expect(res2.status).toBe(200);
      expect(res2.body.data.ticket).toMatchObject({
        id: ticket3.id,
        displayNumber: 'CRY-003',
        queueNumber: 3,
        status: 'CALLED',
        waitingAhead: 0,
        series: {
          id: crySeries.id,
          code: 'CRY',
          name: crySeries.name,
        },
      });
      expect(new Date(res2.body.data.ticket.calledAt).getTime()).toBeCloseTo(calledTime.getTime(), -3);
    });
  });

  describe('TEST-35: Boundary and Role Security for my-ticket (AC-35, FR-05, BR-04)', () => {
    it('(a) returns 404 NO_ACTIVE_TICKET when collector has no active ticket', async () => {
      const res = await request(app)
        .get('/api/tickets/my-ticket')
        .set(getAuthHeader(collector4Token));

      expect(res.status).toBe(404);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'NO_ACTIVE_TICKET',
        message: expect.stringMatching(/no active/i),
        statusCode: 404,
      });
    });

    it('(b) returns 404 NO_ACTIVE_TICKET when collector prior ticket is COMPLETED', async () => {
      // Create a COMPLETED ticket for collector1
      await createTicketFixture({
        userId: collector1User.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.COMPLETED,
        completedAt: new Date(),
      });

      const res = await request(app)
        .get('/api/tickets/my-ticket')
        .set(getAuthHeader(collector1Token));

      expect(res.status).toBe(404);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'NO_ACTIVE_TICKET',
        message: expect.stringMatching(/no active/i),
        statusCode: 404,
      });
    });

    it('(c) rejects Box Master with 403 FORBIDDEN_ROLE', async () => {
      const res = await request(app)
        .get('/api/tickets/my-ticket')
        .set(getAuthHeader(staffCryToken));

      expect(res.status).toBe(403);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'FORBIDDEN_ROLE',
        message: expect.stringMatching(/insufficient|forbidden|access denied/i),
        statusCode: 403,
      });
    });

    it('rejects unauthenticated request with 401 UNAUTHENTICATED', async () => {
      const res = await request(app).get('/api/tickets/my-ticket');

      expect(res.status).toBe(401);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'UNAUTHENTICATED',
        message: expect.stringMatching(/authentication required|unauthenticated/i),
        statusCode: 401,
      });
    });
  });
});
