import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState, createTicketFixture } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';

describe('Concurrency: Box Master Call Next Races (TEST-32, AC-32, BR-03, BR-06, NFR-04)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-32a: two staff members calling next simultaneously receive distinct sequential tickets without collision (SKIP LOCKED)', async () => {
    // 1. Arrange: Fetch 2 staff assigned to CRY and 3 distinct collectors (BR-02 compliance)
    const staff1 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const staff2 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby2' } });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const collector3 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector3' } });

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

    const ticket3 = await createTicketFixture({
      userId: collector3.id,
      seriesId: crySeries.id,
      queueNumber: 3,
      displayNumber: 'CRY-003',
      status: 'WAITING',
    });

    const token1 = signTestToken(staff1.id, staff1.role, staff1.tokenVersion);
    const token2 = signTestToken(staff2.id, staff2.role, staff2.tokenVersion);

    // 2. Act: Fire simultaneous call-next requests from both staff members
    const [res1, res2] = await Promise.all([
      request(app)
        .post('/api/staff/call-next')
        .set('Authorization', `Bearer ${token1}`)
        .send({ seriesId: crySeries.id }),
      request(app)
        .post('/api/staff/call-next')
        .set('Authorization', `Bearer ${token2}`)
        .send({ seriesId: crySeries.id }),
    ]);

    // 3. Assert: Both requests succeed with 200 OK
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    const ticketId1 = res1.body.data.ticketId;
    const ticketId2 = res2.body.data.ticketId;

    // Both tickets must be strictly distinct (SKIP LOCKED prevented double-booking)
    expect(ticketId1).not.toBe(ticketId2);

    const calledTicketIds = [ticketId1, ticketId2];
    expect(calledTicketIds).toContain(ticket1.id);
    expect(calledTicketIds).toContain(ticket2.id);

    // Verify DB integrity: Both tickets are CALLED with respective handlers
    const dbTicket1 = await prisma.queueTicket.findUnique({ where: { id: ticket1.id } });
    const dbTicket2 = await prisma.queueTicket.findUnique({ where: { id: ticket2.id } });
    const dbTicket3 = await prisma.queueTicket.findUnique({ where: { id: ticket3.id } });

    expect(dbTicket1?.status).toBe('CALLED');
    expect(dbTicket2?.status).toBe('CALLED');
    expect(dbTicket1?.handledByStaffId).not.toBeNull();
    expect(dbTicket2?.handledByStaffId).not.toBeNull();
    expect(dbTicket1?.handledByStaffId).not.toBe(dbTicket2?.handledByStaffId);

    // Ticket 3 must remain untouched in WAITING status
    expect(dbTicket3?.status).toBe('WAITING');
    expect(dbTicket3?.handledByStaffId).toBeNull();
  });

  it('TEST-32b: 5 concurrent call-next requests from the same staff yield exactly 1 success and 4 STAFF_BUSY rejections', async () => {
    // 1. Arrange: 5 WAITING tickets from 5 distinct collectors (BR-02 compliance)
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collectors = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } }),
      prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } }),
      prisma.user.findUniqueOrThrow({ where: { username: 'collector3' } }),
      prisma.user.findUniqueOrThrow({ where: { username: 'collector4' } }),
      prisma.user.findUniqueOrThrow({ where: { username: 'collector5' } }),
    ]);

    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    for (let i = 0; i < collectors.length; i++) {
      await createTicketFixture({
        userId: collectors[i].id,
        seriesId: crySeries.id,
        queueNumber: i + 1,
        displayNumber: `CRY-00${i + 1}`,
        status: 'WAITING',
      });
    }

    const token = signTestToken(staff.id, staff.role, staff.tokenVersion);
    const concurrentRequests = 5;

    // 2. Act: Fire 5 simultaneous call-next requests from the same staff member
    const requests = Array.from({ length: concurrentRequests }, () =>
      request(app)
        .post('/api/staff/call-next')
        .set('Authorization', `Bearer ${token}`)
        .send({ seriesId: crySeries.id }),
    );

    const responses = await Promise.all(requests);

    // 3. Assert: Exactly 1 success (200) and exactly 4 rejections (409 STAFF_BUSY)
    const successResponses = responses.filter((r) => r.status === 200);
    const busyResponses = responses.filter((r) => r.status === 409);

    expect(successResponses.length).toBe(1);
    expect(busyResponses.length).toBe(concurrentRequests - 1);

    for (const r of busyResponses) {
      expect(r.body.error.code).toBe('STAFF_BUSY');
    }

    // 4. Verify DB integrity: Exactly 1 ticket is CALLED by this staff, 4 remain WAITING
    const activeStaffTickets = await prisma.queueTicket.findMany({
      where: {
        handledByStaffId: staff.id,
        status: 'CALLED',
      },
    });
    expect(activeStaffTickets.length).toBe(1);

    const waitingTickets = await prisma.queueTicket.findMany({
      where: {
        seriesId: crySeries.id,
        status: 'WAITING',
      },
    });
    expect(waitingTickets.length).toBe(concurrentRequests - 1);
  });
});
