import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { Role, TicketStatus } from '@prisma/client';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { FakeClock } from '../../src/utils/clock.js';
import {
  resetQueueState,
  createTicketFixture,
  transitionTicketToCalled,
} from '../helpers/queue-helper.js';
import { signTestToken, getAuthHeader } from '../helpers/auth-helper.js';

describe('Concurrency: No-Show vs Start-Unboxing Race Guard (TEST-43F, AC-43.5)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-43F: concurrent no-show and start-unboxing at >=120s lets exactly one succeed (200) and rejects loser with 400 INVALID_STATE_TRANSITION', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const calledAt = new Date('2026-11-25T10:00:00.000Z');
    const fakeClock = new FakeClock(new Date(calledAt.getTime() + 120_000));
    const appWithClock = createApp({ clock: fakeClock });

    const ticket = await createTicketFixture({
      userId: collector.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticket.id, staff.id, calledAt);

    const staffToken = signTestToken(staff.id, Role.BOX_MASTER, staff.tokenVersion);

    const [noShowRes, startRes] = await Promise.all([
      request(appWithClock)
        .post(`/api/staff/tickets/${ticket.id}/no-show`)
        .set(getAuthHeader(staffToken)),
      request(appWithClock)
        .post(`/api/staff/tickets/${ticket.id}/start-unboxing`)
        .set(getAuthHeader(staffToken)),
    ]);

    expect([noShowRes.status, startRes.status].sort()).toEqual([200, 400]);

    const dbTicket = await prisma.queueTicket.findUniqueOrThrow({ where: { id: ticket.id } });
    if (noShowRes.status === 200) {
      expect(noShowRes.body.data.status).toBe('NO_SHOW');
      expect(startRes.status).toBe(400);
      expect(startRes.body.error.code).toBe('INVALID_STATE_TRANSITION');
      expect(dbTicket.status).toBe(TicketStatus.NO_SHOW);
      expect(dbTicket.forfeitedAt).not.toBeNull();
      expect(dbTicket.startedAt).toBeNull();
    } else {
      expect(startRes.status).toBe(200);
      expect(startRes.body.data.status).toBe('UNBOXING');
      expect(noShowRes.status).toBe(400);
      expect(noShowRes.body.error.code).toBe('INVALID_STATE_TRANSITION');
      expect(dbTicket.status).toBe(TicketStatus.UNBOXING);
      expect(dbTicket.startedAt).not.toBeNull();
      expect(dbTicket.forfeitedAt).toBeNull();
    }
  });
});
