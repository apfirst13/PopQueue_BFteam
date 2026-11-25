import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { TicketStatus } from '@prisma/client';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import {
  resetQueueState,
  createTicketFixture,
  transitionTicketToCalled,
  transitionTicketToUnboxing,
} from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';

describe('Series Availability Control API: PATCH /api/staff/series/:id/status (F-09, AC-46.1..46.5)', () => {
  const restoreDefaultSeriesStates = async () => {
    await prisma.series.updateMany({ where: { code: { in: ['CRY', 'LAB'] } }, data: { isActive: true } });
    await prisma.series.updateMany({ where: { code: 'SKP' }, data: { isActive: false } });
  };

  beforeEach(async () => {
    await resetQueueState();
    await restoreDefaultSeriesStates();
  });

  afterAll(async () => {
    await resetQueueState();
    await restoreDefaultSeriesStates();
  });

  it('TEST-46A (AC-46.1): allows assigned BOX_MASTER to toggle series isActive status and returns 200', async () => {
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const staffToken = signTestToken(staffCry.id, staffCry.role, staffCry.tokenVersion);

    const res = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        id: crySeries.id,
        code: 'CRY',
        name: crySeries.name,
        isActive: false,
      },
    });

    const dbSeries = await prisma.series.findUniqueOrThrow({ where: { id: crySeries.id } });
    expect(dbSeries.isActive).toBe(false);

    // GET /api/staff/tickets reflects isActive: false and still includes the closed series
    const ticketsRes = await request(app)
      .get('/api/staff/tickets')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(ticketsRes.status).toBe(200);
    const cryItem = ticketsRes.body.data.series.find((s: { code: string }) => s.code === 'CRY');
    expect(cryItem).toBeDefined();
    expect(cryItem.isActive).toBe(false);
  });

  it('TEST-46B (AC-46.2, CF-04, CF-05): rejects collector join with 409 SERIES_CLOSED and updates public board visibility', async () => {
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const staffToken = signTestToken(staffCry.id, staffCry.role, staffCry.tokenVersion);
    const collectorToken = signTestToken(collector1.id, collector1.role, collector1.tokenVersion);

    // Create 1 active waiting ticket BEFORE closing CRY so CF-05 board rule is verifiable too
    await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const closeRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: false });
    expect(closeRes.status).toBe(200);

    // CF-04: New collector join must be blocked with 409 SERIES_CLOSED
    const joinRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${collectorToken}`)
      .send({ seriesId: crySeries.id });

    expect(joinRes.status).toBe(409);
    expect(joinRes.body.error.code).toBe('SERIES_CLOSED');

    // CF-05: Closed series with remaining active ticket stays visible on public board with isActive: false
    const boardRes = await request(app).get('/api/public/queue-board');
    expect(boardRes.status).toBe(200);
    const cryBoard = boardRes.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard).toBeDefined();
    expect(cryBoard.isActive).toBe(false);
    expect(cryBoard.waitingCount).toBe(1);
  });

  it('TEST-46C (AC-46.3): rejects BOX_MASTER toggling an unassigned series with 403 FORBIDDEN_SERIES', async () => {
    const staffLab = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_labubu' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const labToken = signTestToken(staffLab.id, staffLab.role, staffLab.tokenVersion);

    const res = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${labToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_SERIES');

    const dbSeries = await prisma.series.findUniqueOrThrow({ where: { id: crySeries.id } });
    expect(dbSeries.isActive).toBe(true);
  });

  it('TEST-46D (AC-46.4): continues serving existing UNBOXING, CALLED, and WAITING tickets smoothly when series is closed', async () => {
    const staff1 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const staff2 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby2' } });
    const collectors = await prisma.user.findMany({
      where: { role: 'COLLECTOR' },
      orderBy: { username: 'asc' },
      take: 3,
    });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const staff1Token = signTestToken(staff1.id, staff1.role, staff1.tokenVersion);
    const staff2Token = signTestToken(staff2.id, staff2.role, staff2.tokenVersion);

    // 1. Existing UNBOXING ticket handled by staff1
    const ticketUnboxing = await createTicketFixture({
      userId: collectors[0].id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticketUnboxing.id, staff1.id);
    await transitionTicketToUnboxing(ticketUnboxing.id, staff1.id);

    // 2. Existing CALLED ticket handled by staff2
    const ticketCalled = await createTicketFixture({
      userId: collectors[1].id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(ticketCalled.id, staff2.id);

    // 3. Existing WAITING ticket
    const ticketWaiting = await createTicketFixture({
      userId: collectors[2].id,
      seriesId: crySeries.id,
      queueNumber: 3,
      displayNumber: 'CRY-003',
      status: TicketStatus.WAITING,
    });

    // Close CRY
    const closeRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staff1Token}`)
      .send({ isActive: false });
    expect(closeRes.status).toBe(200);
    expect(closeRes.body.data.isActive).toBe(false);

    // GET /api/staff/tickets still discovers closed CRY and its waiting queue
    const discoveryRes = await request(app)
      .get('/api/staff/tickets')
      .set('Authorization', `Bearer ${staff1Token}`);
    expect(discoveryRes.status).toBe(200);
    const cryDiscovery = discoveryRes.body.data.series.find((s: { code: string }) => s.code === 'CRY');
    expect(cryDiscovery).toBeDefined();
    expect(cryDiscovery.isActive).toBe(false);
    expect(cryDiscovery.waitingQueue.map((q: { id: string }) => q.id)).toEqual([ticketWaiting.id]);

    // Step A: Complete existing UNBOXING ticket while closed
    const complete1Res = await request(app)
      .post(`/api/staff/tickets/${ticketUnboxing.id}/complete`)
      .set('Authorization', `Bearer ${staff1Token}`);
    expect(complete1Res.status).toBe(200);
    expect(complete1Res.body.data.status).toBe('COMPLETED');

    // Step B: Start Unboxing + Complete existing CALLED ticket while closed
    const start2Res = await request(app)
      .post(`/api/staff/tickets/${ticketCalled.id}/start-unboxing`)
      .set('Authorization', `Bearer ${staff2Token}`);
    expect(start2Res.status).toBe(200);
    expect(start2Res.body.data.status).toBe('UNBOXING');

    const complete2Res = await request(app)
      .post(`/api/staff/tickets/${ticketCalled.id}/complete`)
      .set('Authorization', `Bearer ${staff2Token}`);
    expect(complete2Res.status).toBe(200);
    expect(complete2Res.body.data.status).toBe('COMPLETED');

    // Step C: Call Next on existing WAITING ticket -> Start -> Complete while still closed
    const call3Res = await request(app)
      .post('/api/staff/call-next')
      .set('Authorization', `Bearer ${staff1Token}`)
      .send({ seriesId: crySeries.id });
    expect(call3Res.status).toBe(200);
    expect(call3Res.body.data.ticketId).toBe(ticketWaiting.id);
    expect(call3Res.body.data.displayNumber).toBe('CRY-003');
    expect(call3Res.body.data.status).toBe('CALLED');

    const start3Res = await request(app)
      .post(`/api/staff/tickets/${ticketWaiting.id}/start-unboxing`)
      .set('Authorization', `Bearer ${staff1Token}`);
    expect(start3Res.status).toBe(200);

    const complete3Res = await request(app)
      .post(`/api/staff/tickets/${ticketWaiting.id}/complete`)
      .set('Authorization', `Bearer ${staff1Token}`);
    expect(complete3Res.status).toBe(200);

    // Once all tickets are finished while closed, public board hides CRY (DEC-04 / CF-05)
    const boardAfterClear = await request(app).get('/api/public/queue-board');
    expect(boardAfterClear.status).toBe(200);
    expect(
      boardAfterClear.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY'),
    ).toBeUndefined();
  });

  it('TEST-46E (AC-46.5): is idempotent when repeating same status and allows collector join after re-opening', async () => {
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const staffToken = signTestToken(staffCry.id, staffCry.role, staffCry.tokenVersion);
    const collectorToken = signTestToken(collector1.id, collector1.role, collector1.tokenVersion);

    // Round 1: Close CRY
    const close1 = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: false });
    expect(close1.status).toBe(200);
    expect(close1.body.data.isActive).toBe(false);

    // Round 2: Repeat isActive: false (idempotent)
    const close2 = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: false });
    expect(close2.status).toBe(200);
    expect(close2.body.data.isActive).toBe(false);

    // Round 3: Re-open CRY
    const reopenRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: true });
    expect(reopenRes.status).toBe(200);
    expect(reopenRes.body.data.isActive).toBe(true);

    // Collector can immediately join again -> 201 Created
    const joinRes = await request(app)
      .post('/api/tickets/join')
      .set('Authorization', `Bearer ${collectorToken}`)
      .send({ seriesId: crySeries.id });
    expect(joinRes.status).toBe(201);
    expect(joinRes.body.data.displayNumber).toBe('CRY-001');
    expect(joinRes.body.data.status).toBe('WAITING');
  });

  it('TEST-46F (AC-46.3, CF-07): enforces 401, 403 FORBIDDEN_ROLE, 400 VALIDATION_ERROR, and 404 RESOURCE_NOT_FOUND', async () => {
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    const collectorToken = signTestToken(collector1.id, collector1.role, collector1.tokenVersion);
    const staffToken = signTestToken(staffCry.id, staffCry.role, staffCry.tokenVersion);

    // 1) No auth header -> 401 UNAUTHENTICATED
    const unauthRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .send({ isActive: false });
    expect(unauthRes.status).toBe(401);
    expect(unauthRes.body.error.code).toBe('UNAUTHENTICATED');

    // 2) Collector JWT -> 403 FORBIDDEN_ROLE (CF-07)
    const collectorRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${collectorToken}`)
      .send({ isActive: false });
    expect(collectorRes.status).toBe(403);
    expect(collectorRes.body.error.code).toBe('FORBIDDEN_ROLE');

    // 3a) Non-boolean body { isActive: "disabled" } -> 400 VALIDATION_ERROR
    const badBodyRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: 'disabled' });
    expect(badBodyRes.status).toBe(400);
    expect(badBodyRes.body.error.code).toBe('VALIDATION_ERROR');

    // 3b) Missing isActive field -> 400 VALIDATION_ERROR
    const emptyBodyRes = await request(app)
      .patch(`/api/staff/series/${crySeries.id}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({});
    expect(emptyBodyRes.status).toBe(400);
    expect(emptyBodyRes.body.error.code).toBe('VALIDATION_ERROR');

    // 3c) Invalid UUID path param -> 400 VALIDATION_ERROR
    const badUuidRes = await request(app)
      .patch('/api/staff/series/not-a-valid-uuid/status')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: false });
    expect(badUuidRes.status).toBe(400);
    expect(badUuidRes.body.error.code).toBe('VALIDATION_ERROR');

    // 4) Nonexistent Series UUID -> 404 RESOURCE_NOT_FOUND
    const notFoundRes = await request(app)
      .patch('/api/staff/series/00000000-0000-0000-0000-000000000000/status')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ isActive: false });
    expect(notFoundRes.status).toBe(404);
    expect(notFoundRes.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});
