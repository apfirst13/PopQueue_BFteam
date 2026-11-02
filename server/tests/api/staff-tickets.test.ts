import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState, createTicketFixture, transitionTicketToCalled } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';

describe('Staff Service Counter API: GET /api/staff/tickets (F-03, AC-21, FR-07, BR-05)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-21: returns assigned series queues for staff_crybaby and staff_labubu without cross-series leakage', async () => {
    // 1. Arrange: Fetch seed staff, collectors, and series
    const staffCry = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const staffLab = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_labubu' } });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const collector3 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector3' } });

    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const labSeries = await prisma.series.findUniqueOrThrow({ where: { code: 'LAB' } });

    // Create fixtures: CRY has 2 WAITING tickets, LAB has 1 WAITING ticket
    const ticketCry1 = await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: 'WAITING',
    });

    await createTicketFixture({
      userId: collector2.id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: 'WAITING',
    });

    await createTicketFixture({
      userId: collector3.id,
      seriesId: labSeries.id,
      queueNumber: 1,
      displayNumber: 'LAB-001',
      status: 'WAITING',
    });

    const cryToken = signTestToken(staffCry.id, staffCry.role, staffCry.tokenVersion);
    const labToken = signTestToken(staffLab.id, staffLab.role, staffLab.tokenVersion);

    // 2. Act & Assert: staff_crybaby gets CRY only, ordered by queueDate and queueNumber asc
    const cryRes = await request(app)
      .get('/api/staff/tickets')
      .set('Authorization', `Bearer ${cryToken}`);

    expect(cryRes.status).toBe(200);
    expect(cryRes.body).toHaveProperty('data');
    expect(cryRes.body.data).toHaveProperty('series');
    expect(Array.isArray(cryRes.body.data.series)).toBe(true);

    // staff_crybaby only assigned to CRY
    const crySeriesList = cryRes.body.data.series;
    expect(crySeriesList.some((s: { code: string }) => s.code === 'LAB')).toBe(false);

    const cryItem = crySeriesList.find((s: { code: string }) => s.code === 'CRY');
    expect(cryItem).toBeDefined();
    expect(cryItem.seriesId).toBe(crySeries.id);
    expect(cryItem.activeServing).toBeNull();
    expect(cryItem.waitingQueue.length).toBe(2);
    expect(cryItem.waitingQueue[0].displayNumber).toBe('CRY-001');
    expect(cryItem.waitingQueue[0].queueNumber).toBe(1);
    expect(cryItem.waitingQueue[0].userFullName).toBe(collector1.fullName);
    expect(cryItem.waitingQueue[1].displayNumber).toBe('CRY-002');
    expect(cryItem.waitingQueue[1].queueNumber).toBe(2);
    expect(cryItem.waitingQueue[1].userFullName).toBe(collector2.fullName);
    expect(cryItem.waitingQueue[0].queueNumber).toBeLessThan(cryItem.waitingQueue[1].queueNumber);

    // 3. Act & Assert: staff_labubu gets LAB only
    const labRes = await request(app)
      .get('/api/staff/tickets')
      .set('Authorization', `Bearer ${labToken}`);

    expect(labRes.status).toBe(200);
    const labSeriesList = labRes.body.data.series;
    expect(labSeriesList.some((s: { code: string }) => s.code === 'CRY')).toBe(false);

    const labItem = labSeriesList.find((s: { code: string }) => s.code === 'LAB');
    expect(labItem).toBeDefined();
    expect(labItem.seriesId).toBe(labSeries.id);
    expect(labItem.activeServing).toBeNull();
    expect(labItem.waitingQueue.length).toBe(1);
    expect(labItem.waitingQueue[0].displayNumber).toBe('LAB-001');

    // 4. Positive control: When staff_crybaby has activeServing (CALLED)
    await transitionTicketToCalled(ticketCry1.id, staffCry.id);

    const cryResWithServing = await request(app)
      .get('/api/staff/tickets')
      .set('Authorization', `Bearer ${cryToken}`);

    expect(cryResWithServing.status).toBe(200);
    const cryUpdatedItem = cryResWithServing.body.data.series.find((s: { code: string }) => s.code === 'CRY');
    expect(cryUpdatedItem.activeServing).not.toBeNull();
    expect(cryUpdatedItem.activeServing.id).toBe(ticketCry1.id);
    expect(cryUpdatedItem.activeServing.displayNumber).toBe('CRY-001');
    expect(cryUpdatedItem.activeServing.status).toBe('CALLED');
    expect(cryUpdatedItem.activeServing.calledAt).toBeDefined();
    expect(cryUpdatedItem.activeServing.startedAt).toBeNull();
    expect(cryUpdatedItem.waitingQueue.length).toBe(1);
    expect(cryUpdatedItem.waitingQueue[0].displayNumber).toBe('CRY-002');
  });
});
