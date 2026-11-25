import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { TicketStatus } from '@prisma/client';
import { app, createApp } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { FakeClock, getQueueDateAsDate } from '../../src/utils/clock.js';
import {
  resetQueueState,
  createTicketFixture,
  transitionTicketToCalled,
} from '../helpers/queue-helper.js';

describe('Public Queue Display Board API: GET /api/public/queue-board (F-07, AC-44.1..44.8)', () => {
  beforeEach(async () => {
    await resetQueueState();
    // Restore default series active states
    await prisma.series.updateMany({ where: { code: { in: ['CRY', 'LAB'] } }, data: { isActive: true } });
    await prisma.series.updateMany({ where: { code: 'SKP' }, data: { isActive: false } });
  });

  afterAll(async () => {
    await resetQueueState();
    await prisma.series.updateMany({ where: { code: { in: ['CRY', 'LAB'] } }, data: { isActive: true } });
    await prisma.series.updateMany({ where: { code: 'SKP' }, data: { isActive: false } });
  });

  it('TEST-44A: allows unauthenticated access (200), excludes PII, and filters out COMPLETED/NO_SHOW/CANCELLED', async () => {
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const staff1 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const staff2 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby2' } });
    const collectors = await prisma.user.findMany({
      where: { role: 'COLLECTOR' },
      orderBy: { username: 'asc' },
      take: 6,
    });
    expect(collectors.length).toBeGreaterThanOrEqual(6);

    const now = new Date('2026-11-25T10:00:00.000Z');

    // 1. UNBOXING (handled by staff1)
    const tUnboxing = await createTicketFixture({
      userId: collectors[0].id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await prisma.queueTicket.update({
      where: { id: tUnboxing.id },
      data: {
        status: TicketStatus.UNBOXING,
        handledByStaffId: staff1.id,
        calledAt: new Date('2026-11-25T09:50:00.000Z'),
        startedAt: new Date('2026-11-25T09:52:00.000Z'),
      },
    });

    // 2. CALLED (handled by staff2)
    const tCalled = await createTicketFixture({
      userId: collectors[1].id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(tCalled.id, staff2.id, new Date('2026-11-25T09:55:00.000Z'));

    // 3. WAITING
    await createTicketFixture({
      userId: collectors[2].id,
      seriesId: crySeries.id,
      queueNumber: 3,
      displayNumber: 'CRY-003',
      status: TicketStatus.WAITING,
    });

    // 4. Inactive tickets: COMPLETED, NO_SHOW, CANCELLED
    await createTicketFixture({
      userId: collectors[3].id,
      seriesId: crySeries.id,
      queueNumber: 4,
      displayNumber: 'CRY-004',
      status: TicketStatus.COMPLETED,
      calledAt: new Date('2026-11-25T09:30:00.000Z'),
      startedAt: new Date('2026-11-25T09:31:00.000Z'),
      completedAt: new Date('2026-11-25T09:35:00.000Z'),
    });
    await prisma.queueTicket.create({
      data: {
        userId: collectors[4].id,
        seriesId: crySeries.id,
        queueDate: getQueueDateAsDate(),
        queueNumber: 5,
        displayNumber: 'CRY-005',
        status: TicketStatus.NO_SHOW,
        calledAt: new Date('2026-11-25T09:36:00.000Z'),
        forfeitedAt: new Date('2026-11-25T09:39:00.000Z'),
      },
    });
    await prisma.queueTicket.create({
      data: {
        userId: collectors[5].id,
        seriesId: crySeries.id,
        queueDate: getQueueDateAsDate(),
        queueNumber: 6,
        displayNumber: 'CRY-006',
        status: TicketStatus.CANCELLED,
        forfeitedAt: new Date('2026-11-25T09:40:00.000Z'),
      },
    });

    const fakeClock = new FakeClock(now);
    const testApp = createApp({ clock: fakeClock });

    const res = await request(testApp).get('/api/public/queue-board');

    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toContain('no-store');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.timestamp).toBe(now.toISOString());
    expect(Array.isArray(res.body.data.boards)).toBe(true);

    const cryBoard = res.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard).toBeDefined();
    expect(cryBoard.seriesName).toBe(crySeries.name);
    expect(cryBoard.isActive).toBe(true);
    expect(cryBoard.waitingCount).toBe(1);
    expect(cryBoard.upNext).toEqual([{ queueNumber: 3, displayNumber: 'CRY-003' }]);
    expect(cryBoard.nowServing).toEqual([
      { displayNumber: 'CRY-001', status: 'UNBOXING' },
      { displayNumber: 'CRY-002', status: 'CALLED' },
    ]);

    // Zero PII assertion on serialized response body (keys & seeded user values)
    const rawJson = JSON.stringify(res.body);
    const forbiddenKeys = [
      'userId',
      'username',
      'passwordHash',
      'fullName',
      'tokenVersion',
      'handledByStaffId',
    ];
    for (const key of forbiddenKeys) {
      expect(rawJson).not.toContain(key);
    }

    const allUsers = await prisma.user.findMany({
      select: { id: true, username: true, fullName: true },
    });
    for (const u of allUsers) {
      expect(rawJson).not.toContain(u.id);
      expect(rawJson).not.toContain(u.username);
      expect(rawJson).not.toContain(u.fullName);
    }

    // Inactive ticket numbers must NOT appear anywhere
    expect(rawJson).not.toContain('CRY-004');
    expect(rawJson).not.toContain('CRY-005');
    expect(rawJson).not.toContain('CRY-006');
  });

  it('TEST-44B: caps upNext at UP_NEXT_LIMIT=5 and returns accurate waitingCount across 5, 6, and 8 waiting tickets', async () => {
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const seededCollectors = await prisma.user.findMany({
      where: { role: 'COLLECTOR' },
      orderBy: { username: 'asc' },
      take: 6,
    });

    // Create 2 synthetic collectors so we can hold 8 simultaneous active tickets in CRY
    const extraCollectors = await Promise.all([
      prisma.user.create({
        data: {
          username: 'synthetic_collector_board_7',
          passwordHash: 'unused-hash-placeholder',
          fullName: 'Synthetic Collector 7',
          role: 'COLLECTOR',
        },
      }),
      prisma.user.create({
        data: {
          username: 'synthetic_collector_board_8',
          passwordHash: 'unused-hash-placeholder',
          fullName: 'Synthetic Collector 8',
          role: 'COLLECTOR',
        },
      }),
    ]);

    const allCollectors = [...seededCollectors, ...extraCollectors];

    // 1. Add 5 waiting tickets (queueNumber 4..8)
    for (let i = 0; i < 5; i++) {
      const qNum = 4 + i;
      await createTicketFixture({
        userId: allCollectors[i].id,
        seriesId: crySeries.id,
        queueNumber: qNum,
        displayNumber: `CRY-${String(qNum).padStart(3, '0')}`,
        status: TicketStatus.WAITING,
      });
    }

    let res = await request(app).get('/api/public/queue-board');
    expect(res.status).toBe(200);
    let cryBoard = res.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard.waitingCount).toBe(5);
    expect(cryBoard.upNext).toHaveLength(5);
    expect(cryBoard.upNext.map((t: { queueNumber: number }) => t.queueNumber)).toEqual([4, 5, 6, 7, 8]);

    // 2. Add 6th waiting ticket (queueNumber 9)
    await createTicketFixture({
      userId: allCollectors[5].id,
      seriesId: crySeries.id,
      queueNumber: 9,
      displayNumber: 'CRY-009',
      status: TicketStatus.WAITING,
    });

    res = await request(app).get('/api/public/queue-board');
    cryBoard = res.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard.waitingCount).toBe(6);
    expect(cryBoard.upNext).toHaveLength(5);
    expect(cryBoard.upNext.map((t: { queueNumber: number }) => t.queueNumber)).toEqual([4, 5, 6, 7, 8]);

    // 3. Add 7th and 8th waiting tickets (queueNumber 10, 11)
    for (let i = 6; i < 8; i++) {
      const qNum = 4 + i;
      await createTicketFixture({
        userId: allCollectors[i].id,
        seriesId: crySeries.id,
        queueNumber: qNum,
        displayNumber: `CRY-${String(qNum).padStart(3, '0')}`,
        status: TicketStatus.WAITING,
      });
    }

    res = await request(app).get('/api/public/queue-board');
    cryBoard = res.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard.waitingCount).toBe(8);
    expect(cryBoard.upNext).toHaveLength(5);
    expect(cryBoard.upNext.map((t: { queueNumber: number }) => t.queueNumber)).toEqual([4, 5, 6, 7, 8]);
  });

  it('TEST-44D: includes a closed series (isActive=false) on the board when it still has active tickets', async () => {
    const crySeries = await prisma.series.update({
      where: { code: 'CRY' },
      data: { isActive: false },
    });
    const collector1 = await prisma.user.findUniqueOrThrow({ where: { username: 'collector1' } });

    await createTicketFixture({
      userId: collector1.id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });

    const res = await request(app).get('/api/public/queue-board');
    expect(res.status).toBe(200);

    const cryBoard = res.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard).toBeDefined();
    expect(cryBoard.isActive).toBe(false);
    expect(cryBoard.waitingCount).toBe(1);
    expect(cryBoard.upNext).toEqual([{ queueNumber: 1, displayNumber: 'CRY-001' }]);
  });

  it('TEST-44E: sorts upNext by integer queueNumber ASC (9 before 10) and respects queueDate ASC across days', async () => {
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const collectors = await prisma.user.findMany({
      where: { role: 'COLLECTOR' },
      orderBy: { username: 'asc' },
      take: 3,
    });

    const today = getQueueDateAsDate(new Date('2026-11-25T10:00:00.000Z'));
    const yesterday = getQueueDateAsDate(new Date('2026-11-24T10:00:00.000Z'));

    // Insert queue 10 before queue 9 on same date
    await createTicketFixture({
      userId: collectors[0].id,
      seriesId: crySeries.id,
      queueDate: today,
      queueNumber: 10,
      displayNumber: 'CRY-010',
      status: TicketStatus.WAITING,
    });
    await createTicketFixture({
      userId: collectors[1].id,
      seriesId: crySeries.id,
      queueDate: today,
      queueNumber: 9,
      displayNumber: 'CRY-009',
      status: TicketStatus.WAITING,
    });

    const res = await request(app).get('/api/public/queue-board');
    expect(res.status).toBe(200);
    let cryBoard = res.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard.upNext[0].queueNumber).toBe(9);
    expect(cryBoard.upNext[1].queueNumber).toBe(10);

    // Overnight leftover ticket from yesterday with queueNumber 20 must come BEFORE today's 9 & 10 (FACTS F6)
    await createTicketFixture({
      userId: collectors[2].id,
      seriesId: crySeries.id,
      queueDate: yesterday,
      queueNumber: 20,
      displayNumber: 'CRY-020',
      status: TicketStatus.WAITING,
    });

    const res2 = await request(app).get('/api/public/queue-board');
    cryBoard = res2.body.data.boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    expect(cryBoard.waitingCount).toBe(3);
    expect(cryBoard.upNext.map((t: { displayNumber: string }) => t.displayNumber)).toEqual([
      'CRY-020',
      'CRY-009',
      'CRY-010',
    ]);
  });

  it('TEST-44G: sorts nowServing by calledAt ASC, hides empty closed series (DEC-04), and keeps empty open series', async () => {
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const staff1 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby' } });
    const staff2 = await prisma.user.findUniqueOrThrow({ where: { username: 'staff_crybaby2' } });
    const collectors = await prisma.user.findMany({
      where: { role: 'COLLECTOR' },
      orderBy: { username: 'asc' },
      take: 2,
    });

    // Staff 2 called CRY-002 LATER (10:05)
    const tLater = await createTicketFixture({
      userId: collectors[0].id,
      seriesId: crySeries.id,
      queueNumber: 2,
      displayNumber: 'CRY-002',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(tLater.id, staff2.id, new Date('2026-11-25T10:05:00.000Z'));

    // Staff 1 called CRY-001 EARLIER (10:01)
    const tEarlier = await createTicketFixture({
      userId: collectors[1].id,
      seriesId: crySeries.id,
      queueNumber: 1,
      displayNumber: 'CRY-001',
      status: TicketStatus.WAITING,
    });
    await transitionTicketToCalled(tEarlier.id, staff1.id, new Date('2026-11-25T10:01:00.000Z'));

    const res = await request(app).get('/api/public/queue-board');
    expect(res.status).toBe(200);

    const boards = res.body.data.boards;
    const cryBoard = boards.find((b: { seriesCode: string }) => b.seriesCode === 'CRY');
    const labBoard = boards.find((b: { seriesCode: string }) => b.seriesCode === 'LAB');
    const skpBoard = boards.find((b: { seriesCode: string }) => b.seriesCode === 'SKP');

    // (1) nowServing sorted by calledAt ASC
    expect(cryBoard.nowServing).toEqual([
      { displayNumber: 'CRY-001', status: 'CALLED' },
      { displayNumber: 'CRY-002', status: 'CALLED' },
    ]);

    // (2) SKP is closed and has 0 tickets -> hidden (DEC-04)
    expect(skpBoard).toBeUndefined();

    // (3) LAB is open and has 0 tickets -> still visible with empty arrays & waitingCount=0
    expect(labBoard).toBeDefined();
    expect(labBoard.isActive).toBe(true);
    expect(labBoard.nowServing).toEqual([]);
    expect(labBoard.upNext).toEqual([]);
    expect(labBoard.waitingCount).toBe(0);
  });
});
