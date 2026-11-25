import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { Role, TicketStatus } from '@prisma/client';
import { createApp } from '../../src/app.js';
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

describe('F-06 Server-Enforced 120s No-Show & serverNow API (TEST-42, TEST-43)', () => {
  let collector1: { id: string };
  let collector2: { id: string };
  let staffCry1: { id: string };
  let staffLab: { id: string };

  let crySeries: { id: string; code: string; name: string };

  let collector1Token: string;
  let staffCry1Token: string;
  let staffCry2Token: string;
  let staffLabToken: string;

  beforeAll(async () => {
    const c1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const c2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const sCry1 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const sCry2 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby2' } });
    const sLab = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_labubu' } });
    const cry = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    collector1 = c1;
    collector2 = c2;
    staffCry1 = sCry1;
    staffLab = sLab;
    crySeries = cry;

    collector1Token = signTestToken(c1.id, Role.COLLECTOR, c1.tokenVersion);
    staffCry1Token = signTestToken(sCry1.id, Role.BOX_MASTER, sCry1.tokenVersion);
    staffCry2Token = signTestToken(sCry2.id, Role.BOX_MASTER, sCry2.tokenVersion);
    staffLabToken = signTestToken(sLab.id, Role.BOX_MASTER, sLab.tokenVersion);
  });

  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-42A (AC-42.1, AC-42.2): rejects premature no-show at +45.4s and +119s with Math.ceil remainingSeconds and keeps STAFF_BUSY', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const fakeClock = new FakeClock(new Date(calledAt.getTime() + 45_400));
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket.id, staffCry1.id, calledAt);

    // Waiting ticket for follow-up call-next check
    await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: TicketStatus.WAITING,
    });

    // At +45.4s -> remainingMs = 74,600ms -> ceil = 75s
    const resEarly = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(staffCry1Token));

    expect(resEarly.status).toBe(400);
    expect(resEarly.body.data).toBeUndefined();
    expect(resEarly.body.error).toEqual({
      code: 'NO_SHOW_WINDOW_NOT_EXPIRED',
      message: 'No-show window has not expired yet',
      statusCode: 400,
      details: { remainingSeconds: 75 },
    });

    // Boundary +119s -> remainingSeconds = 1
    fakeClock.setTime(new Date(calledAt.getTime() + 119_000));
    const resBoundary119 = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(staffCry1Token));

    expect(resBoundary119.status).toBe(400);
    expect(resBoundary119.body.error).toEqual({
      code: 'NO_SHOW_WINDOW_NOT_EXPIRED',
      message: 'No-show window has not expired yet',
      statusCode: 400,
      details: { remainingSeconds: 1 },
    });

    // Staff must remain STAFF_BUSY and ticket must stay CALLED
    const callNextBusyRes = await request(appWithClock)
      .post('/api/staff/call-next')
      .set(getAuthHeader(staffCry1Token))
      .send({ seriesId: crySeries.id });

    expect(callNextBusyRes.status).toBe(409);
    expect(callNextBusyRes.body.error.code).toBe('STAFF_BUSY');

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(dbTicket.status).toBe(TicketStatus.CALLED);
    expect(dbTicket.forfeitedAt).toBeNull();
  });

  it('TEST-42B (AC-42.2, AC-43.1): marks ticket NO_SHOW at exact +120s boundary with forfeitedAt from application clock', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const exactCutoff = new Date(calledAt.getTime() + 120_000);
    const fakeClock = new FakeClock(exactCutoff);
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket.id, staffCry1.id, calledAt);

    const res = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(staffCry1Token));

    expect(res.status).toBe(200);
    expect(Object.keys(res.body)).toEqual(['data']);
    expect(res.body.data).toEqual({
      id: ticket.id,
      displayNumber: 'CRY-001',
      status: 'NO_SHOW',
      forfeitedAt: exactCutoff.toISOString(),
    });

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(dbTicket.status).toBe(TicketStatus.NO_SHOW);
    expect(dbTicket.forfeitedAt?.toISOString()).toBe(exactCutoff.toISOString());
  });

  it('TEST-42C (AC-42.2): marks ticket NO_SHOW at +121s after calledAt', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const now121 = new Date(calledAt.getTime() + 121_000);
    const fakeClock = new FakeClock(now121);
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket.id, staffCry1.id, calledAt);

    const res = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(staffCry1Token));

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('NO_SHOW');
    expect(res.body.data.forfeitedAt).toBe(now121.toISOString());
  });

  it('TEST-42D (AC-42.3): returns ISO 8601 serverNow from application clock on call-next, my-ticket, and staff/tickets', async () => {
    const fixedNow = new Date('2026-11-25T15:00:00.000Z');
    const fakeClock = new FakeClock(fixedNow);
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    // 1. POST /api/staff/call-next
    const callNextRes = await request(appWithClock)
      .post('/api/staff/call-next')
      .set(getAuthHeader(staffCry1Token))
      .send({ seriesId: crySeries.id });

    expect(callNextRes.status).toBe(200);
    expect(callNextRes.body.data.ticketId).toBe(ticket.id);
    expect(callNextRes.body.data.serverNow).toBe(fixedNow.toISOString());

    // Advance clock 30s to prove subsequent reads reflect updated clock
    const laterNow = new Date('2026-11-25T15:00:30.000Z');
    fakeClock.setTime(laterNow);

    // 2. GET /api/tickets/my-ticket
    const myTicketRes = await request(appWithClock)
      .get('/api/tickets/my-ticket')
      .set(getAuthHeader(collector1Token));

    expect(myTicketRes.status).toBe(200);
    expect(myTicketRes.body.data.ticket.id).toBe(ticket.id);
    expect(myTicketRes.body.data.tickets).toHaveLength(1);
    expect(myTicketRes.body.data.serverNow).toBe(laterNow.toISOString());

    // 3. GET /api/staff/tickets
    const staffTicketsRes = await request(appWithClock)
      .get('/api/staff/tickets')
      .set(getAuthHeader(staffCry1Token));

    expect(staffTicketsRes.status).toBe(200);
    expect(Array.isArray(staffTicketsRes.body.data.series)).toBe(true);
    expect(staffTicketsRes.body.data.serverNow).toBe(laterNow.toISOString());
  });

  it('TEST-43A & TEST-43B (AC-43.1, AC-43.2, CF-02): blocks call-next with 409 STAFF_BUSY before no-show and succeeds immediately after NO_SHOW', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const fakeClock = new FakeClock(new Date(calledAt.getTime() + 60_000));
    const appWithClock = createApp({ clock: fakeClock });

    const ticket1 = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    const ticket2 = await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket1.id, staffCry1.id, calledAt);

    // TEST-43A: Still busy before No-Show
    const busyRes = await request(appWithClock)
      .post('/api/staff/call-next')
      .set(getAuthHeader(staffCry1Token))
      .send({ seriesId: crySeries.id });
    expect(busyRes.status).toBe(409);
    expect(busyRes.body.error.code).toBe('STAFF_BUSY');

    // TEST-43B: Advance past 120s, mark NO_SHOW, then call-next returns CRY-002
    fakeClock.setTime(new Date(calledAt.getTime() + 120_000));
    const noShowRes = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket1.id}/no-show`)
      .set(getAuthHeader(staffCry1Token));
    expect(noShowRes.status).toBe(200);
    expect(noShowRes.body.data.status).toBe('NO_SHOW');

    const callNextRes = await request(appWithClock)
      .post('/api/staff/call-next')
      .set(getAuthHeader(staffCry1Token))
      .send({ seriesId: crySeries.id });

    expect(callNextRes.status).toBe(200);
    expect(callNextRes.body.data.ticketId).toBe(ticket2.id);
    expect(callNextRes.body.data.displayNumber).toBe('CRY-002');
    expect(callNextRes.body.data.status).toBe('CALLED');
  });

  it('TEST-43C (AC-43.3): rejects another handler of the same series with 403 FORBIDDEN_NOT_HANDLER even after 150s', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const fakeClock = new FakeClock(new Date(calledAt.getTime() + 150_000));
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket.id, staffCry1.id, calledAt);

    const res = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(staffCry2Token));

    expect(res.status).toBe(403);
    expect(res.body.data).toBeUndefined();
    expect(res.body.error).toEqual({
      code: 'FORBIDDEN_NOT_HANDLER',
      message: expect.any(String),
      statusCode: 403,
    });

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(dbTicket.status).toBe(TicketStatus.CALLED);
    expect(dbTicket.handledByStaffId).toBe(staffCry1.id);
  });

  describe('TEST-43D (AC-43.4, EV-A04): rejects WAITING and non-CALLED ticket states with 400 INVALID_STATE_TRANSITION', () => {
    it.each([
      TicketStatus.WAITING,
      TicketStatus.UNBOXING,
      TicketStatus.COMPLETED,
      TicketStatus.CANCELLED,
      TicketStatus.NO_SHOW,
    ])('rejects no-show on %s ticket with 400 INVALID_STATE_TRANSITION', async (status) => {
      const baseTime = new Date('2026-11-25T10:00:00.000Z');
      const fakeClock = new FakeClock(new Date(baseTime.getTime() + 180_000));
      const appWithClock = createApp({ clock: fakeClock });

      const ticket = await createTicketFixture({
        userId: collector1.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.WAITING,
      });

      if (status === TicketStatus.UNBOXING) {
        await transitionTicketToCalled(ticket.id, staffCry1.id, baseTime);
        await transitionTicketToUnboxing(ticket.id, staffCry1.id, new Date(baseTime.getTime() + 10_000));
      } else if (status === TicketStatus.COMPLETED) {
        await transitionTicketToCalled(ticket.id, staffCry1.id, baseTime);
        await transitionTicketToUnboxing(ticket.id, staffCry1.id, new Date(baseTime.getTime() + 10_000));
        await transitionTicketToCompleted(ticket.id, staffCry1.id, new Date(baseTime.getTime() + 60_000));
      } else if (status === TicketStatus.CANCELLED || status === TicketStatus.NO_SHOW) {
        await prisma.queueTicket.update({
          where: { id: ticket.id },
          data: { status, forfeitedAt: baseTime },
        });
      }

      const res = await request(appWithClock)
        .post(`/api/staff/tickets/${ticket.id}/no-show`)
        .set(getAuthHeader(staffCry1Token));

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

  it('TEST-43E (AC-43.6, DEC-02): allows collector marked NO_SHOW to immediately join the same series with monotonic next number', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const fakeClock = new FakeClock(calledAt);
    const appWithClock = createApp({ clock: fakeClock });

    // Join CRY via API so QueueCounter is initialized cleanly
    const join1 = await request(appWithClock)
      .post('/api/tickets/join')
      .set(getAuthHeader(collector1Token))
      .send({ seriesId: crySeries.id });
    expect(join1.status).toBe(201);
    expect(join1.body.data.displayNumber).toBe('CRY-001');

    const callRes = await request(appWithClock)
      .post('/api/staff/call-next')
      .set(getAuthHeader(staffCry1Token))
      .send({ seriesId: crySeries.id });
    expect(callRes.status).toBe(200);

    fakeClock.setTime(new Date(calledAt.getTime() + 120_000));
    const noShowRes = await request(appWithClock)
      .post(`/api/staff/tickets/${join1.body.data.ticketId}/no-show`)
      .set(getAuthHeader(staffCry1Token));
    expect(noShowRes.status).toBe(200);
    expect(noShowRes.body.data.status).toBe('NO_SHOW');

    // Immediate re-join succeeds (201) with CRY-002 (not blocked by 409 DUPLICATE_ACTIVE_QUEUE)
    const rejoin = await request(appWithClock)
      .post('/api/tickets/join')
      .set(getAuthHeader(collector1Token))
      .send({ seriesId: crySeries.id });

    expect(rejoin.status).toBe(201);
    expect(rejoin.body.data.displayNumber).toBe('CRY-002');
    expect(rejoin.body.data.queueNumber).toBe(2);
    expect(rejoin.body.data.status).toBe('WAITING');
  });

  it('TEST-43G & TEST-43H (AC-43.7): rejects COLLECTOR with 403 FORBIDDEN_ROLE and unauthenticated with 401 UNAUTHENTICATED', async () => {
    const appWithClock = createApp();
    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const roleRes = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(collector1Token));
    expect(roleRes.status).toBe(403);
    expect(roleRes.body.error).toEqual({
      code: 'FORBIDDEN_ROLE',
      message: expect.stringMatching(/insufficient|forbidden/i),
      statusCode: 403,
    });

    const unauthRes = await request(appWithClock).post(
      `/api/staff/tickets/${ticket.id}/no-show`,
    );
    expect(unauthRes.status).toBe(401);
    expect(unauthRes.body.error).toEqual({
      code: 'UNAUTHENTICATED',
      message: expect.stringMatching(/authentication required|unauthenticated/i),
      statusCode: 401,
    });
  });

  it('TEST-43K (AC-43.10, DEC-03): enforces FORBIDDEN_SERIES, 404/400 validation, and allows start-unboxing at +150s if no-show not triggered', async () => {
    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const fakeClock = new FakeClock(new Date(calledAt.getTime() + 150_000));
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket.id, staffCry1.id, calledAt);

    // 1. Unassigned series staff -> 403 FORBIDDEN_SERIES (before NOT_HANDLER)
    const seriesRes = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/no-show`)
      .set(getAuthHeader(staffLabToken));
    expect(seriesRes.status).toBe(403);
    expect(seriesRes.body.error).toEqual({
      code: 'FORBIDDEN_SERIES',
      message: expect.any(String),
      statusCode: 403,
    });

    // 2a. Unknown UUID -> 404 RESOURCE_NOT_FOUND
    const notFoundRes = await request(appWithClock)
      .post('/api/staff/tickets/99999999-9999-9999-9999-999999999999/no-show')
      .set(getAuthHeader(staffCry1Token));
    expect(notFoundRes.status).toBe(404);
    expect(notFoundRes.body.error).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: expect.stringMatching(/not found/i),
      statusCode: 404,
    });

    // 2b. Invalid UUID -> 400 VALIDATION_ERROR
    const badUuidRes = await request(appWithClock)
      .post('/api/staff/tickets/not-a-valid-uuid/no-show')
      .set(getAuthHeader(staffCry1Token));
    expect(badUuidRes.status).toBe(400);
    expect(badUuidRes.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: expect.stringMatching(/uuid/i),
      statusCode: 400,
    });

    // 3. DEC-03: After +150s without pressing no-show, handler can still start-unboxing
    const startRes = await request(appWithClock)
      .post(`/api/staff/tickets/${ticket.id}/start-unboxing`)
      .set(getAuthHeader(staffCry1Token));
    expect(startRes.status).toBe(200);
    expect(startRes.body.data.status).toBe('UNBOXING');

    // Verify unused reference satisfies lint cleanly
    expect(staffLab.id).toBeTruthy();
  });
});
