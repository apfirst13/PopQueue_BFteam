import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState, createTicketFixture, transitionTicketToCalled } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';

describe('Call Next Queue Ticket API: POST /api/staff/call-next (F-03, AC-22..25, AC-31)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-22: calls lowest WAITING ticket (FIFO), sets status=CALLED, handledByStaffId, and calledAt', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const ticket1 = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: 'WAITING',
    });

    const ticket2 = await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: 'WAITING',
    });

    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

    const response = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: crySeries.id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    const { ticketId, displayNumber, status, handledByStaffId, calledAt } = response.body.data;

    expect(ticketId).toBe(ticket1.id);
    expect(displayNumber).toBe('CRY-001');
    expect(status).toBe('CALLED');
    expect(handledByStaffId).toBe(staff.id);
    expect(calledAt).toBeDefined();

    // Verify in database
    const dbTicket1 = await prisma.queueTicket.findUnique({ where: { id: ticket1.id } });
    expect(dbTicket1?.status).toBe('CALLED');
    expect(dbTicket1?.handledByStaffId).toBe(staff.id);
    expect(dbTicket1?.calledAt).not.toBeNull();

    // Ticket 2 must remain WAITING
    const dbTicket2 = await prisma.queueTicket.findUnique({ where: { id: ticket2.id } });
    expect(dbTicket2?.status).toBe('WAITING');
    expect(dbTicket2?.handledByStaffId).toBeNull();
  });

  it('TEST-23: returns 404 EMPTY_QUEUE when no WAITING tickets exist in the series', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

    const response = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: crySeries.id });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.code).toBe('EMPTY_QUEUE');
    expect(response.body.error.statusCode).toBe(404);
  });

  it('TEST-24: returns 409 STAFF_BUSY when staff already has an active serving ticket (CALLED or UNBOXING)', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    // Active serving ticket for staff
    const activeTicket = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: 'WAITING',
    });
    await transitionTicketToCalled(activeTicket.id, staff.id);

    // Another waiting ticket in queue
    const waitingTicket = await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: 'WAITING',
    });

    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

    const response = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: crySeries.id });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('STAFF_BUSY');
    expect(response.body.error.statusCode).toBe(409);

    // Verify DB integrity: Waiting ticket status and handledByStaffId remain untouched
    const dbWaitingTicket = await prisma.queueTicket.findUnique({ where: { id: waitingTicket.id } });
    expect(dbWaitingTicket?.status).toBe('WAITING');
    expect(dbWaitingTicket?.handledByStaffId).toBeNull();
  });

  it('TEST-25: returns 403 FORBIDDEN_SERIES when staff attempts to call next in unassigned series', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const labSeries = await prisma.series.findUniqueOrThrow({ where: { code: 'LAB' } });

    const labTicket = await createTicketFixture({
      userId: collector.id,
      seriesId: labSeries.id,
      queueNumber: 1,
      displayNumber: 'LAB-001',
      status: 'WAITING',
    });

    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

    // staff_crybaby is NOT assigned to LAB
    const response = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: labSeries.id });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN_SERIES');
    expect(response.body.error.statusCode).toBe(403);

    // Verify LAB ticket remains WAITING with no staff assignment
    const dbLabTicket = await prisma.queueTicket.findUnique({ where: { id: labTicket.id } });
    expect(dbLabTicket?.status).toBe('WAITING');
    expect(dbLabTicket?.handledByStaffId).toBeNull();
  });

  it('Schema Validation: returns 400 VALIDATION_ERROR for missing or malformed seriesId', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);

    // Missing seriesId
    const missingRes = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(missingRes.status).toBe(400);
    expect(missingRes.body.error.code).toBe('VALIDATION_ERROR');

    // Malformed seriesId
    const malformedRes = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: 'not-a-valid-uuid' });
    expect(malformedRes.status).toBe(400);
    expect(malformedRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.each([
    { method: 'GET', path: '/api/staff/tickets', body: undefined },
    { method: 'POST', path: '/api/staff/call-next', body: { seriesId: '00000000-0000-0000-0000-000000000000' } },
  ])('TEST-31: rejects Collector attempting to access $method $path with 403 FORBIDDEN_ROLE and preserves DB', async ({ method, path, body }) => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const ticket = await createTicketFixture({
      userId: collector.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: 'WAITING',
    });

    const token = signTestToken(collector.id, collector.role, collector.tokenVersion);

    const req = method === 'GET'
      ? request(app).get(path).set('Authorization', `Bearer ${token}`)
      : request(app).post(path).set('Authorization', `Bearer ${token}`).send(body);

    const response = await req;
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN_ROLE');

    // DB integrity check: Ticket status and handler remain unchanged
    const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticket.id } });
    expect(dbTicket?.status).toBe('WAITING');
    expect(dbTicket?.handledByStaffId).toBeNull();
  });
});
