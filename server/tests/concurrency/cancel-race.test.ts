import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { Role, TicketStatus } from '@prisma/client';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState, createTicketFixture } from '../helpers/queue-helper.js';
import { signTestToken, getAuthHeader } from '../helpers/auth-helper.js';

describe('Concurrency: Cancel vs Call-Next Race Guard (TEST-41H, AC-41.8, CF-01)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-41H: concurrent cancel and call-next on single WAITING ticket yields deterministic winner and loser without dual-state corruption', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const collectorToken = signTestToken(collector.id, Role.COLLECTOR, collector.tokenVersion);
    const staffToken = signTestToken(staff.id, Role.BOX_MASTER, staff.tokenVersion);

    const ticket = await createTicketFixture({
      userId: collector.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const [cancelRes, callNextRes] = await Promise.all([
      request(app)
        .post(`/api/tickets/${ticket.id}/cancel`)
        .set(getAuthHeader(collectorToken)),
      request(app)
        .post('/api/staff/call-next')
        .set(getAuthHeader(staffToken))
        .send({ seriesId: crySeries.id }),
    ]);

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });

    if (cancelRes.status === 200) {
      // Cancel reached DB first -> call-next must see empty queue
      expect(cancelRes.body.data.status).toBe('CANCELLED');
      expect(callNextRes.status).toBe(404);
      expect(callNextRes.body.error.code).toBe('EMPTY_QUEUE');
      expect(dbTicket.status).toBe(TicketStatus.CANCELLED);
      expect(dbTicket.forfeitedAt).not.toBeNull();
      expect(dbTicket.handledByStaffId).toBeNull();
    } else {
      // Call-next reached DB first -> cancel must fail with INVALID_STATE_TRANSITION
      expect(callNextRes.status).toBe(200);
      expect(callNextRes.body.data.ticketId).toBe(ticket.id);
      expect(callNextRes.body.data.status).toBe('CALLED');
      expect(cancelRes.status).toBe(400);
      expect(cancelRes.body.error.code).toBe('INVALID_STATE_TRANSITION');
      expect(dbTicket.status).toBe(TicketStatus.CALLED);
      expect(dbTicket.handledByStaffId).toBe(staff.id);
      expect(dbTicket.forfeitedAt).toBeNull();
    }
  });

  it('simultaneous duplicate cancel requests on the same WAITING ticket: exactly one succeeds (200) and one fails (400 INVALID_STATE_TRANSITION)', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const collectorToken = signTestToken(collector.id, Role.COLLECTOR, collector.tokenVersion);

    const ticket = await createTicketFixture({
      userId: collector.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const [res1, res2] = await Promise.all([
      request(app).post(`/api/tickets/${ticket.id}/cancel`).set(getAuthHeader(collectorToken)),
      request(app).post(`/api/tickets/${ticket.id}/cancel`).set(getAuthHeader(collectorToken)),
    ]);

    expect([res1.status, res2.status].sort()).toEqual([200, 400]);

    const loser = res1.status === 400 ? res1 : res2;
    expect(loser.body.error.code).toBe('INVALID_STATE_TRANSITION');

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(dbTicket.status).toBe(TicketStatus.CANCELLED);
    expect(dbTicket.forfeitedAt).not.toBeNull();
  });
});
