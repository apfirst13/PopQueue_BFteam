import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { Role, TicketStatus } from '@prisma/client';
import { app, createApp } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { FakeClock } from '../../src/utils/clock.js';
import { signTestToken, getAuthHeader } from '../helpers/auth-helper.js';
import {
  resetQueueState,
  createTicketFixture,
  transitionTicketToCalled,
  transitionTicketToUnboxing,
  transitionTicketToCompleted,
} from '../helpers/queue-helper.js';

describe('F-05 Queue Cancellation API: POST /api/tickets/:id/cancel (TEST-41)', () => {
  let collector1: { id: string };
  let collector2: { id: string };
  let staffCry: { id: string };
  let crySeries: { id: string; code: string; name: string };
  let labSeries: { id: string; code: string; name: string };

  let collector1Token: string;
  let collector2Token: string;
  let staffCryToken: string;

  beforeAll(async () => {
    const c1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const c2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const cry = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const lab = await prisma.series.findUniqueOrThrow({ where: { code: 'LAB' } });

    collector1 = c1;
    collector2 = c2;
    staffCry = staff;
    crySeries = cry;
    labSeries = lab;

    collector1Token = signTestToken(c1.id, Role.COLLECTOR, c1.tokenVersion);
    collector2Token = signTestToken(c2.id, Role.COLLECTOR, c2.tokenVersion);
    staffCryToken = signTestToken(staff.id, Role.BOX_MASTER, staff.tokenVersion);
  });

  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-41A (AC-41.1): cancels a WAITING ticket, sets status=CANCELLED and forfeitedAt from application clock', async () => {
    const fixedNow = new Date('2026-11-25T10:30:00.000Z');
    const fakeClock = new FakeClock(fixedNow);
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const res = await request(appWithClock)
      .post(`/api/tickets/${ticket.id}/cancel`)
      .set(getAuthHeader(collector1Token));

    expect(res.status).toBe(200);
    expect(Object.keys(res.body)).toEqual(['data']);
    expect(res.body.data).toEqual({
      id: ticket.id,
      seriesId: crySeries.id,
      displayNumber: 'CRY-001',
      status: 'CANCELLED',
      forfeitedAt: fixedNow.toISOString(),
    });

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(dbTicket.status).toBe(TicketStatus.CANCELLED);
    expect(dbTicket.forfeitedAt?.toISOString()).toBe(fixedNow.toISOString());
  });

  it('TEST-41B (AC-41.2, AC-41.3): releases series quota for immediate re-join, preserves monotonic counter (CRY-003), and decrements waitingAhead', async () => {
    // 1. Collector 1 and Collector 2 join CRY
    const join1 = await request(app)
      .post('/api/tickets/join')
      .set(getAuthHeader(collector1Token))
      .send({ seriesId: crySeries.id });
    expect(join1.status).toBe(201);
    expect(join1.body.data.displayNumber).toBe('CRY-001');

    const join2 = await request(app)
      .post('/api/tickets/join')
      .set(getAuthHeader(collector2Token))
      .send({ seriesId: crySeries.id });
    expect(join2.status).toBe(201);
    expect(join2.body.data.displayNumber).toBe('CRY-002');

    // Collector 2 initially has waitingAhead = 1
    const myTicketBefore = await request(app)
      .get('/api/tickets/my-ticket')
      .set(getAuthHeader(collector2Token));
    expect(myTicketBefore.status).toBe(200);
    expect(myTicketBefore.body.data.ticket.waitingAhead).toBe(1);

    // 2. Collector 1 cancels CRY-001
    const cancelRes = await request(app)
      .post(`/api/tickets/${join1.body.data.ticketId}/cancel`)
      .set(getAuthHeader(collector1Token));
    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe('CANCELLED');

    // Collector 2 now has waitingAhead = 0 immediately
    const myTicketAfter = await request(app)
      .get('/api/tickets/my-ticket')
      .set(getAuthHeader(collector2Token));
    expect(myTicketAfter.status).toBe(200);
    expect(myTicketAfter.body.data.ticket.waitingAhead).toBe(0);

    // Counter did not decrement (still 2)
    const counterBeforeRejoin = await prisma.queueCounter.findFirstOrThrow({
      where: { seriesId: crySeries.id },
    });
    expect(counterBeforeRejoin.lastNumber).toBe(2);

    // 3. Collector 1 immediately re-joins CRY -> 201 CRY-003 (monotonic, no 409)
    const rejoin = await request(app)
      .post('/api/tickets/join')
      .set(getAuthHeader(collector1Token))
      .send({ seriesId: crySeries.id });
    expect(rejoin.status).toBe(201);
    expect(rejoin.body.data.displayNumber).toBe('CRY-003');
    expect(rejoin.body.data.queueNumber).toBe(3);

    const counterAfterRejoin = await prisma.queueCounter.findFirstOrThrow({
      where: { seriesId: crySeries.id },
    });
    expect(counterAfterRejoin.lastNumber).toBe(3);
  });

  it('TEST-41C (AC-41.4, Decision 4): rejects foreign collector with 403 FORBIDDEN_OWNERSHIP before state check and without leaking metadata', async () => {
    const waitingTicket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const resWaiting = await request(app)
      .post(`/api/tickets/${waitingTicket.id}/cancel`)
      .set(getAuthHeader(collector2Token));

    expect(resWaiting.status).toBe(403);
    expect(Object.keys(resWaiting.body)).toEqual(['error']);
    expect(resWaiting.body.error).toEqual({
      code: 'FORBIDDEN_OWNERSHIP',
      message: expect.stringMatching(/permission|forbidden|ownership/i),
      statusCode: 403,
    });
    const rawBody = JSON.stringify(resWaiting.body);
    expect(rawBody).not.toContain('CRY-001');
    expect(rawBody).not.toContain(crySeries.id);

    const dbWaiting = await prisma.queueTicket.findUniqueOrThrow({ where: { id: waitingTicket.id } });
    expect(dbWaiting.status).toBe(TicketStatus.WAITING);
    expect(dbWaiting.forfeitedAt).toBeNull();

    // Decision 4: Ownership precedence over INVALID_STATE_TRANSITION on non-WAITING ticket
    await transitionTicketToCalled(waitingTicket.id, staffCry.id);
    const resCalled = await request(app)
      .post(`/api/tickets/${waitingTicket.id}/cancel`)
      .set(getAuthHeader(collector2Token));

    expect(resCalled.status).toBe(403);
    expect(resCalled.body.error.code).toBe('FORBIDDEN_OWNERSHIP');
  });

  describe('TEST-41D (AC-41.5): rejects non-WAITING ticket states with 400 INVALID_STATE_TRANSITION', () => {
    it.each([
      TicketStatus.CALLED,
      TicketStatus.UNBOXING,
      TicketStatus.COMPLETED,
      TicketStatus.NO_SHOW,
      TicketStatus.CANCELLED,
    ])('rejects cancelling ticket in %s status with 400 INVALID_STATE_TRANSITION', async (status) => {
      const ticket = await createTicketFixture({
        userId: collector1.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.WAITING,
      });

      if (status === TicketStatus.CALLED) {
        await transitionTicketToCalled(ticket.id, staffCry.id);
      } else if (status === TicketStatus.UNBOXING) {
        await transitionTicketToCalled(ticket.id, staffCry.id);
        await transitionTicketToUnboxing(ticket.id, staffCry.id);
      } else if (status === TicketStatus.COMPLETED) {
        await transitionTicketToCalled(ticket.id, staffCry.id);
        await transitionTicketToUnboxing(ticket.id, staffCry.id);
        await transitionTicketToCompleted(ticket.id, staffCry.id);
      } else if (status === TicketStatus.NO_SHOW || status === TicketStatus.CANCELLED) {
        await prisma.queueTicket.update({
          where: { id: ticket.id },
          data: { status, forfeitedAt: new Date() },
        });
      }

      const res = await request(app)
        .post(`/api/tickets/${ticket.id}/cancel`)
        .set(getAuthHeader(collector1Token));

      expect(res.status).toBe(400);
      expect(res.body.data).toBeUndefined();
      expect(res.body.error).toEqual({
        code: 'INVALID_STATE_TRANSITION',
        message: expect.any(String),
        statusCode: 400,
      });

      const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
      expect(dbTicket.status).toBe(status);
    });
  });

  it('TEST-41F (AC-41.6): staff call-next skips CANCELLED tickets and calls the next WAITING ticket', async () => {
    const cancelledTicket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    const waitingTicket = await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: TicketStatus.WAITING,
    });

    const cancelRes = await request(app)
      .post(`/api/tickets/${cancelledTicket.id}/cancel`)
      .set(getAuthHeader(collector1Token));
    expect(cancelRes.status).toBe(200);

    const callRes = await request(app)
      .post('/api/staff/call-next')
      .set(getAuthHeader(staffCryToken))
      .send({ seriesId: crySeries.id });

    expect(callRes.status).toBe(200);
    expect(callRes.body.data.ticketId).toBe(waitingTicket.id);
    expect(callRes.body.data.displayNumber).toBe('CRY-002');
    expect(callRes.body.data.status).toBe('CALLED');
  });

  it('TEST-41G (AC-41.7): cancelling one series ticket keeps active tickets in other series intact (BR-02 v2)', async () => {
    const cryTicket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    const labTicket = await createTicketFixture({
      userId: collector1.id,
      seriesId: labSeries.id,
      queueNumber: 1,
      displayNumber: 'LAB-001',
      status: TicketStatus.WAITING,
    });

    const cancelRes = await request(app)
      .post(`/api/tickets/${cryTicket.id}/cancel`)
      .set(getAuthHeader(collector1Token));
    expect(cancelRes.status).toBe(200);

    const myTicketRes = await request(app)
      .get('/api/tickets/my-ticket')
      .set(getAuthHeader(collector1Token));

    expect(myTicketRes.status).toBe(200);
    expect(myTicketRes.body.data.tickets).toHaveLength(1);
    expect(myTicketRes.body.data.tickets[0].id).toBe(labTicket.id);
    expect(myTicketRes.body.data.tickets[0].displayNumber).toBe('LAB-001');
    expect(myTicketRes.body.data.tickets[0].status).toBe('WAITING');
  });

  it('TEST-41I (AC-41.9): rejects BOX_MASTER role with 403 FORBIDDEN_ROLE before param validation', async () => {
    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const res = await request(app)
      .post(`/api/tickets/${ticket.id}/cancel`)
      .set(getAuthHeader(staffCryToken));

    expect(res.status).toBe(403);
    expect(res.body.data).toBeUndefined();
    expect(res.body.error).toEqual({
      code: 'FORBIDDEN_ROLE',
      message: expect.stringMatching(/insufficient|forbidden/i),
      statusCode: 403,
    });

    // Role check also precedes :id UUID validation
    const badIdRes = await request(app)
      .post('/api/tickets/not-a-uuid/cancel')
      .set(getAuthHeader(staffCryToken));
    expect(badIdRes.status).toBe(403);
    expect(badIdRes.body.error.code).toBe('FORBIDDEN_ROLE');

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(dbTicket.status).toBe(TicketStatus.WAITING);
  });

  it('TEST-41J (AC-41.9): rejects unauthenticated request with 401 UNAUTHENTICATED', async () => {
    const res = await request(app).post('/api/tickets/00000000-0000-0000-0000-000000000000/cancel');

    expect(res.status).toBe(401);
    expect(res.body.data).toBeUndefined();
    expect(res.body.error).toEqual({
      code: 'UNAUTHENTICATED',
      message: expect.stringMatching(/authentication required|unauthenticated/i),
      statusCode: 401,
    });
  });

  it('TEST-41L (AC-41.11): returns 404 RESOURCE_NOT_FOUND for unknown UUID and 400 VALIDATION_ERROR for invalid UUID', async () => {
    const missingUuidRes = await request(app)
      .post('/api/tickets/99999999-9999-9999-9999-999999999999/cancel')
      .set(getAuthHeader(collector1Token));

    expect(missingUuidRes.status).toBe(404);
    expect(missingUuidRes.body.data).toBeUndefined();
    expect(missingUuidRes.body.error).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: expect.stringMatching(/not found/i),
      statusCode: 404,
    });

    const invalidUuidRes = await request(app)
      .post('/api/tickets/not-a-valid-uuid/cancel')
      .set(getAuthHeader(collector1Token));

    expect(invalidUuidRes.status).toBe(400);
    expect(invalidUuidRes.body.data).toBeUndefined();
    expect(invalidUuidRes.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: expect.stringMatching(/uuid/i),
      statusCode: 400,
    });
  });
});
