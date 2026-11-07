import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import {
  resetQueueState,
  createTicketFixture,
  transitionTicketToCalled,
  transitionTicketToUnboxing,
  transitionTicketToCompleted,
} from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';
import { FakeClock, defaultClock } from '../../src/utils/clock.js';

describe('Staff Ticket State Transitions: Start Unboxing & Complete (F-03, AC-26..30, AC-31)', () => {
  let fakeClock: FakeClock;

  beforeEach(async () => {
    await resetQueueState();
    fakeClock = new FakeClock(new Date('2026-11-02T10:00:00.000Z'));
    app.locals.clock = fakeClock;
  });

  afterEach(() => {
    app.locals.clock = defaultClock;
  });

  afterAll(async () => {
    await resetQueueState();
    app.locals.clock = defaultClock;
  });

  it('TEST-26 & TEST-27: valid path CALLED -> UNBOXING (start) -> COMPLETED with injectable clock timestamps and DB verification', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

    // Initial state: Ticket is CALLED and handled by staff_crybaby
    const ticket = await createTicketFixture({
      userId: collector.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: 'WAITING',
    });
    const calledTime = new Date('2026-11-02T09:55:00.000Z');
    await transitionTicketToCalled(ticket.id, staff.id, calledTime);

    // 1. AC-26 (TEST-26): Start Unboxing
    const startTime = new Date('2026-11-02T10:00:00.000Z');
    fakeClock.setTime(startTime);

    const startRes = await request(app)
      .post(`/api/staff/tickets/${ticket.id}/start-unboxing`)
      .set('Authorization', `Bearer ${token}`);

    expect(startRes.status).toBe(200);
    expect(startRes.body).toHaveProperty('data');
    expect(startRes.body.data).toEqual({
      ticketId: ticket.id,
      status: 'UNBOXING',
      startedAt: startTime.toISOString(),
    });

    // Verify DB after start
    const dbAfterStart = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
    expect(dbAfterStart?.status).toBe('UNBOXING');
    expect(dbAfterStart?.startedAt?.toISOString()).toBe(startTime.toISOString());
    expect(dbAfterStart?.handledByStaffId).toBe(staff.id);

    // 2. AC-27 (TEST-27): Complete Unboxing
    const completeTime = new Date('2026-11-02T10:05:00.000Z');
    fakeClock.setTime(completeTime);

    const completeRes = await request(app)
      .post(`/api/staff/tickets/${ticket.id}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(completeRes.status).toBe(200);
    expect(completeRes.body).toHaveProperty('data');
    expect(completeRes.body.data).toEqual({
      ticketId: ticket.id,
      status: 'COMPLETED',
      completedAt: completeTime.toISOString(),
    });

    // Verify DB after complete: all timestamps and final status persisted
    const dbAfterComplete = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
    expect(dbAfterComplete?.status).toBe('COMPLETED');
    expect(dbAfterComplete?.startedAt?.toISOString()).toBe(startTime.toISOString());
    expect(dbAfterComplete?.completedAt?.toISOString()).toBe(completeTime.toISOString());
    expect(dbAfterComplete?.handledByStaffId).toBe(staff.id);

    // Verify retrievable via ticket inspection API
    const getRes = await request(app)
      .get(`/api/tickets/${ticket.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.status).toBe('COMPLETED');
    expect(getRes.body.data.startedAt).toBe(startTime.toISOString());
    expect(getRes.body.data.completedAt).toBe(completeTime.toISOString());
  });

  describe('TEST-28 (AC-28, BR-03): invalid state transitions rejected with 400 INVALID_STATE_TRANSITION', () => {
    it.each([
      {
        scenario: 'start on WAITING',
        action: 'start-unboxing',
        setupStatus: 'WAITING' as const,
        expectedStatus: 'WAITING',
      },
      {
        scenario: 'complete on CALLED',
        action: 'complete',
        setupStatus: 'CALLED' as const,
        expectedStatus: 'CALLED',
      },
      {
        scenario: 'complete on WAITING',
        action: 'complete',
        setupStatus: 'WAITING' as const,
        expectedStatus: 'WAITING',
      },
      {
        scenario: 'start on UNBOXING (start twice)',
        action: 'start-unboxing',
        setupStatus: 'UNBOXING' as const,
        expectedStatus: 'UNBOXING',
      },
      {
        scenario: 'complete on COMPLETED (complete twice)',
        action: 'complete',
        setupStatus: 'COMPLETED' as const,
        expectedStatus: 'COMPLETED',
      },
      {
        scenario: 'start on COMPLETED',
        action: 'start-unboxing',
        setupStatus: 'COMPLETED' as const,
        expectedStatus: 'COMPLETED',
      },
    ])('rejects $scenario with 400 INVALID_STATE_TRANSITION and preserves DB', async ({ action, setupStatus, expectedStatus }) => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

      const ticket = await createTicketFixture({
        userId: collector.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: setupStatus,
        handledByStaffId: setupStatus !== 'WAITING' ? staff.id : undefined,
      });

      const res = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/${action}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual({
        code: 'INVALID_STATE_TRANSITION',
        message: expect.any(String),
        statusCode: 400,
      });

      // Verify DB status remains unchanged
      const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
      expect(dbTicket?.status).toBe(expectedStatus);
    });
  });

  describe('Authorization, Scope & Validation (TEST-29, TEST-30, TEST-31, 400, 404)', () => {
    it('TEST-31 (AC-31): rejects Collector attempting start-unboxing and complete with 403 FORBIDDEN_ROLE and preserves DB', async () => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const collectorToken = signTestToken(collector.id, collector.role, collector.tokenVersion);

      const ticket = await createTicketFixture({
        userId: collector.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
      });
      await transitionTicketToCalled(ticket.id, staff.id);

      // Collector tries start-unboxing
      const startRes = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/start-unboxing`)
        .set('Authorization', `Bearer ${collectorToken}`);

      expect(startRes.status).toBe(403);
      expect(startRes.body.error).toEqual({
        code: 'FORBIDDEN_ROLE',
        message: expect.any(String),
        statusCode: 403,
      });

      // Collector tries complete
      const completeRes = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/complete`)
        .set('Authorization', `Bearer ${collectorToken}`);

      expect(completeRes.status).toBe(403);
      expect(completeRes.body.error).toEqual({
        code: 'FORBIDDEN_ROLE',
        message: expect.any(String),
        statusCode: 403,
      });

      // Verify DB ticket is untouched
      const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
      expect(dbTicket?.status).toBe('CALLED');
    });

    it('TEST-29 (AC-29, BR-05): rejects staff assigned to another series with 403 FORBIDDEN_SERIES and preserves DB', async () => {
      const staffCrybaby = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const staffLabubu = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_labubu' } });
      const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const labubuToken = signTestToken(staffLabubu.id, staffLabubu.role, staffLabubu.tokenVersion);

      // Ticket belongs to CRY series, called by staff_crybaby
      const ticket = await createTicketFixture({
        userId: collector.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
      });
      await transitionTicketToCalled(ticket.id, staffCrybaby.id);

      // staff_labubu (assigned only to LAB) tries start-unboxing on CRY ticket
      const startRes = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/start-unboxing`)
        .set('Authorization', `Bearer ${labubuToken}`);

      expect(startRes.status).toBe(403);
      expect(startRes.body.error).toEqual({
        code: 'FORBIDDEN_SERIES',
        message: expect.any(String),
        statusCode: 403,
      });

      // staff_labubu tries complete on CRY ticket
      const completeRes = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/complete`)
        .set('Authorization', `Bearer ${labubuToken}`);

      expect(completeRes.status).toBe(403);
      expect(completeRes.body.error).toEqual({
        code: 'FORBIDDEN_SERIES',
        message: expect.any(String),
        statusCode: 403,
      });

      // Verify DB status remains CALLED and handler remains staff_crybaby
      const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
      expect(dbTicket?.status).toBe('CALLED');
      expect(dbTicket?.handledByStaffId).toBe(staffCrybaby.id);
    });

    it('TEST-30 (AC-30, BR-07): rejects staff assigned to same series but not handler with 403 FORBIDDEN_NOT_HANDLER and preserves DB', async () => {
      const staffCrybaby = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const staffCrybaby2 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby2' } });
      const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const crybaby2Token = signTestToken(staffCrybaby2.id, staffCrybaby2.role, staffCrybaby2.tokenVersion);

      // Ticket is called by staff_crybaby
      const ticket = await createTicketFixture({
        userId: collector.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
      });
      await transitionTicketToCalled(ticket.id, staffCrybaby.id);

      // staff_crybaby2 (same CRY series, but NOT handler) tries start-unboxing
      const startRes = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/start-unboxing`)
        .set('Authorization', `Bearer ${crybaby2Token}`);

      expect(startRes.status).toBe(403);
      expect(startRes.body.error).toEqual({
        code: 'FORBIDDEN_NOT_HANDLER',
        message: expect.any(String),
        statusCode: 403,
      });

      // Advance ticket to UNBOXING handled by staff_crybaby
      await transitionTicketToUnboxing(ticket.id, staffCrybaby.id);

      // staff_crybaby2 tries complete
      const completeRes = await request(app)
        .post(`/api/staff/tickets/${ticket.id}/complete`)
        .set('Authorization', `Bearer ${crybaby2Token}`);

      expect(completeRes.status).toBe(403);
      expect(completeRes.body.error).toEqual({
        code: 'FORBIDDEN_NOT_HANDLER',
        message: expect.any(String),
        statusCode: 403,
      });

      // Verify DB status remains UNBOXING and handler remains staff_crybaby
      const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
      expect(dbTicket?.status).toBe('UNBOXING');
      expect(dbTicket?.handledByStaffId).toBe(staffCrybaby.id);
    });

    it('returns 404 RESOURCE_NOT_FOUND for unknown ticket id', async () => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const token = signTestToken(staff.id, staff.role, staff.tokenVersion);
      const nonExistentId = '99999999-9999-9999-9999-999999999999';

      const res = await request(app)
        .post(`/api/staff/tickets/${nonExistentId}/start-unboxing`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual({
        code: 'RESOURCE_NOT_FOUND',
        message: expect.any(String),
        statusCode: 404,
      });
    });

    it('returns 400 VALIDATION_ERROR for malformed ticket id param', async () => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

      const res = await request(app)
        .post('/api/staff/tickets/invalid-not-uuid/start-unboxing')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual({
        code: 'VALIDATION_ERROR',
        message: expect.any(String),
        statusCode: 400,
      });
    });
  });

  describe('Concurrency & Partial Unique Index Verification', () => {
    it('simultaneous start-unboxing requests on the same ticket: exactly one succeeds and one is rejected', async () => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

      const ticket = await createTicketFixture({
        userId: collector.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
      });
      await transitionTicketToCalled(ticket.id, staff.id);

      const [res1, res2] = await Promise.all([
        request(app).post(`/api/staff/tickets/${ticket.id}/start-unboxing`).set('Authorization', `Bearer ${token}`),
        request(app).post(`/api/staff/tickets/${ticket.id}/start-unboxing`).set('Authorization', `Bearer ${token}`),
      ]);

      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([200, 400]);

      const successRes = res1.status === 200 ? res1 : res2;
      const failRes = res1.status === 400 ? res1 : res2;

      expect(successRes.body.data.status).toBe('UNBOXING');
      expect(failRes.body.error.code).toBe('INVALID_STATE_TRANSITION');

      const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
      expect(dbTicket?.status).toBe('UNBOXING');
    });

    it('simultaneous complete requests on the same ticket: exactly one succeeds and one is rejected', async () => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

      const ticket = await createTicketFixture({
        userId: collector.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
      });
      await transitionTicketToCalled(ticket.id, staff.id);
      await transitionTicketToUnboxing(ticket.id, staff.id);

      const [res1, res2] = await Promise.all([
        request(app).post(`/api/staff/tickets/${ticket.id}/complete`).set('Authorization', `Bearer ${token}`),
        request(app).post(`/api/staff/tickets/${ticket.id}/complete`).set('Authorization', `Bearer ${token}`),
      ]);

      const statuses = [res1.status, res2.status].sort();
      expect(statuses).toEqual([200, 400]);

      const successRes = res1.status === 200 ? res1 : res2;
      const failRes = res1.status === 400 ? res1 : res2;

      expect(successRes.body.data.status).toBe('COMPLETED');
      expect(failRes.body.error.code).toBe('INVALID_STATE_TRANSITION');

      const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
      expect(dbTicket?.status).toBe('COMPLETED');
    });

    it('after COMPLETED the staff member can call-next another ticket (proves unique_active_staff_ticket is partial)', async () => {
      const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
      const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
      const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
      const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
      const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

      // First ticket: completed
      const ticket1 = await createTicketFixture({
        userId: collector1.id,
        seriesId: crySeries.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
      });
      await transitionTicketToCompleted(ticket1.id, staff.id);

      // Second ticket: waiting in queue
      const ticket2 = await createTicketFixture({
        userId: collector2.id,
        seriesId: crySeries.id,
        queueNumber: 2,
        displayNumber: 'CRY-002',
        status: 'WAITING',
      });

      // Staff calls next ticket: must succeed with 200 (not 409 STAFF_BUSY)
      const callRes = await request(app)
        .post('/api/staff/call-next')
        .set('Authorization', `Bearer ${token}`)
        .send({ seriesId: crySeries.id });

      expect(callRes.status).toBe(200);
      expect(callRes.body.data.ticketId).toBe(ticket2.id);
      expect(callRes.body.data.status).toBe('CALLED');
      expect(callRes.body.data.handledByStaffId).toBe(staff.id);
    });
  });
});
