import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';
import { getQueueDateAsDate } from '../../src/utils/clock.js';
import { TicketStatus } from '@prisma/client';

describe('Safe Queue Joining API: POST /api/tickets/join (F-02, AC-10..14, AC-18)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-10: creates first ticket CRY-001 with status WAITING and queueNumber 1', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const token = signTestToken(collector.id, collector.role, collector.tokenVersion);

    const response = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: crySeries.id });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    const { ticketId, displayNumber, queueNumber, status, seriesName } = response.body.data;

    expect(ticketId).toBeDefined();
    expect(displayNumber).toBe('CRY-001');
    expect(queueNumber).toBe(1);
    expect(status).toBe('WAITING');
    expect(seriesName).toBe(crySeries.name);

    // Verify in database
    const dbTicket = await prisma.queueTicket.findUnique({ where: { id: ticketId } });
    expect(dbTicket).not.toBeNull();
    expect(dbTicket?.userId).toBe(collector.id);
    expect(dbTicket?.seriesId).toBe(crySeries.id);
    expect(dbTicket?.queueNumber).toBe(1);
    expect(dbTicket?.status).toBe(TicketStatus.WAITING);
  });

  it('TEST-11: rejects join with 409 DUPLICATE_ACTIVE_QUEUE when user already has an active ticket (same or different series)', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const labSeries = await prisma.series.findUniqueOrThrow({ where: { code: 'LAB' } });
    const token = signTestToken(collector.id, collector.role, collector.tokenVersion);

    // 1. Join CRY successfully
    const firstRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: crySeries.id });
    expect(firstRes.status).toBe(201);

    // Record lastNumber after successful join
    const cryCounterBefore = await prisma.queueCounter.findFirst({
      where: { seriesId: crySeries.id },
    });
    const lastNumberBefore = cryCounterBefore?.lastNumber ?? 1;

    // 2. Try joining CRY again -> 409 DUPLICATE_ACTIVE_QUEUE
    const retryRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: crySeries.id });
    expect(retryRes.status).toBe(409);
    expect(retryRes.body.error.code).toBe('DUPLICATE_ACTIVE_QUEUE');

    // 3. Try joining LAB (different series) -> 409 DUPLICATE_ACTIVE_QUEUE
    const crossRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: labSeries.id });
    expect(crossRes.status).toBe(409);
    expect(crossRes.body.error.code).toBe('DUPLICATE_ACTIVE_QUEUE');

    // Verify database integrity: Active tickets count for user is still exactly 1
    const activeTickets = await prisma.queueTicket.findMany({
      where: {
        userId: collector.id,
        status: { in: [TicketStatus.WAITING, TicketStatus.CALLED, TicketStatus.UNBOXING] },
      },
    });
    expect(activeTickets.length).toBe(1);

    // Verify counter rollback: QueueCounter lastNumber was not incremented
    const cryCounterAfter = await prisma.queueCounter.findFirst({
      where: { seriesId: crySeries.id },
    });
    expect(cryCounterAfter?.lastNumber).toBe(lastNumberBefore);
  });

  it('TEST-12: rejects join for closed series (isActive = false) with 409 SERIES_CLOSED', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const skpSeries = await prisma.series.findUniqueOrThrow({ where: { code: 'SKP' } });
    expect(skpSeries.isActive).toBe(false);

    const token = signTestToken(collector.id, collector.role, collector.tokenVersion);

    const response = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: skpSeries.id });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('SERIES_CLOSED');

    // Verify no ticket was created
    const ticketCount = await prisma.queueTicket.count({
      where: { seriesId: skpSeries.id },
    });
    expect(ticketCount).toBe(0);
  });

  it('TEST-13: returns 404 for non-existent seriesId and 400 for malformed/missing body', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const token = signTestToken(collector.id, collector.role, collector.tokenVersion);

    // (a) Non-existent UUID -> 404 RESOURCE_NOT_FOUND
    const notFoundRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: '00000000-0000-0000-0000-000000000000' });
    expect(notFoundRes.status).toBe(404);
    expect(notFoundRes.body.error.code).toBe('RESOURCE_NOT_FOUND');

    // (b) Missing seriesId -> 400 VALIDATION_ERROR
    const missingRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(missingRes.status).toBe(400);
    expect(missingRes.body.error.code).toBe('VALIDATION_ERROR');

    // (c) Malformed UUID -> 400 VALIDATION_ERROR
    const malformedRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token}`)
      .send({ seriesId: 'not-a-valid-uuid' });
    expect(malformedRes.status).toBe(400);
    expect(malformedRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('TEST-14: rejects join request from Box Master with 403 FORBIDDEN_ROLE and unauthenticated with 401', async () => {
    const staff = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const staffToken = signTestToken(staff.id, staff.role, staff.tokenVersion);

    // Box Master -> 403 FORBIDDEN_ROLE
    const forbiddenRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ seriesId: crySeries.id });
    expect(forbiddenRes.status).toBe(403);
    expect(forbiddenRes.body.error.code).toBe('FORBIDDEN_ROLE');

    // Unauthenticated -> 401 UNAUTHENTICATED
    const unauthRes = await request(app)
      .post('/api/tickets/join')
      .send({ seriesId: crySeries.id });
    expect(unauthRes.status).toBe(401);
    expect(unauthRes.body.error.code).toBe('UNAUTHENTICATED');

    // Verify no ticket was created
    const count = await prisma.queueTicket.count();
    expect(count).toBe(0);
  });

  it('TEST-18: assigns sequential number CRY-002 after CRY-001 is COMPLETED (no reuse)', async () => {
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const todayDate = getQueueDateAsDate();

    // 1. Setup ticket CRY-001 as COMPLETED via DB fixture
    await prisma.queueTicket.create({
      data: {
        seriesId: crySeries.id,
        userId: collector1.id,
        queueDate: todayDate,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: TicketStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await prisma.queueCounter.create({
      data: {
        seriesId: crySeries.id,
        queueDate: todayDate,
        lastNumber: 1,
      },
    });

    // 2. Collector 2 joins CRY
    const token2 = signTestToken(collector2.id, collector2.role, collector2.tokenVersion);
    const response = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${token2}`)
      .send({ seriesId: crySeries.id });

    expect(response.status).toBe(201);
    expect(response.body.data.displayNumber).toBe('CRY-002');
    expect(response.body.data.queueNumber).toBe(2);
    expect(response.body.data.status).toBe('WAITING');
  });
});
