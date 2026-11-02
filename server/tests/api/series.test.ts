import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState } from '../helpers/queue-helper.js';
import { getQueueDateAsDate } from '../../src/utils/clock.js';
import { TicketStatus } from '@prisma/client';

describe('Queue Discovery API: GET /api/series (TEST-09, AC-09, FR-03)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-09: returns all series with accurate waitingCount of today without requiring authentication', async () => {
    // 1. Arrange: Find seeded series
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const labSeries = await prisma.series.findUniqueOrThrow({ where: { code: 'LAB' } });
    const skpSeries = await prisma.series.findUniqueOrThrow({ where: { code: 'SKP' } });

    // Find 3 distinct seeded collectors (BR-02 compliance: 1 active ticket per user)
    const collectors = await prisma.user.findMany({
      where: { role: 'COLLECTOR' },
      take: 3,
      orderBy: { username: 'asc' },
    });
    expect(collectors.length).toBeGreaterThanOrEqual(3);

    const todayDate = getQueueDateAsDate();

    // Create 3 WAITING tickets for CRY
    for (let i = 0; i < 3; i++) {
      await prisma.queueTicket.create({
        data: {
          seriesId: crySeries.id,
          userId: collectors[i].id,
          queueDate: todayDate,
          queueNumber: i + 1,
          displayNumber: `CRY-${String(i + 1).padStart(3, '0')}`,
          status: TicketStatus.WAITING,
        },
      });
    }

    // 2. Act: Public call to GET /api/series without Authorization header
    const response = await request(app).get('/api/series');

    // 3. Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    const seriesList = response.body.data;
    expect(seriesList.length).toBe(3);

    const cryItem = seriesList.find((s: { code: string }) => s.code === 'CRY');
    const labItem = seriesList.find((s: { code: string }) => s.code === 'LAB');
    const skpItem = seriesList.find((s: { code: string }) => s.code === 'SKP');

    expect(cryItem).toBeDefined();
    expect(cryItem.id).toBe(crySeries.id);
    expect(cryItem.name).toBe(crySeries.name);
    expect(cryItem.isActive).toBe(true);
    expect(cryItem.waitingCount).toBe(3);

    expect(labItem).toBeDefined();
    expect(labItem.id).toBe(labSeries.id);
    expect(labItem.name).toBe(labSeries.name);
    expect(labItem.isActive).toBe(true);
    expect(labItem.waitingCount).toBe(0);

    expect(skpItem).toBeDefined();
    expect(skpItem.id).toBe(skpSeries.id);
    expect(skpItem.name).toBe(skpSeries.name);
    expect(skpItem.isActive).toBe(false);
    expect(skpItem.waitingCount).toBe(0);

    // Verify privacy: No personal user data exposed
    for (const item of seriesList) {
      expect(item).not.toHaveProperty('userId');
      expect(item).not.toHaveProperty('username');
      expect(item).not.toHaveProperty('tickets');
    }
  });
});
