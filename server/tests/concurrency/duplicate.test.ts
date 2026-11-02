import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';
import { TicketStatus } from '@prisma/client';

describe('Concurrency: Single-User Duplicate Join Race (TEST-16, AC-16, BR-02, NFR-04)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-16: 10 concurrent requests from the same user yield exactly 1 success and 9 rejections with counter rolled back', async () => {
    const collector = await prisma.user.findUniqueOrThrow({ where: { username: 'collector2' } });
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const token = signTestToken(collector.id, collector.role, collector.tokenVersion);
    const concurrentRequests = 10;

    // Act: Fire 10 simultaneous join requests for the same user
    const racePromises = Array.from({ length: concurrentRequests }, () =>
      request(app)
        .post('/api/tickets/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ seriesId: crySeries.id }),
    );

    const responses = await Promise.all(racePromises);

    // Assert: Exactly 1 request succeeds with 201, remaining 9 receive 409 DUPLICATE_ACTIVE_QUEUE
    const successResponses = responses.filter((r) => r.status === 201);
    const conflictResponses = responses.filter((r) => r.status === 409);

    expect(successResponses.length).toBe(1);
    expect(conflictResponses.length).toBe(concurrentRequests - 1);

    for (const r of conflictResponses) {
      expect(r.body.error.code).toBe('DUPLICATE_ACTIVE_QUEUE');
    }

    // Verify database state: Exactly 1 active ticket in DB
    const activeTickets = await prisma.queueTicket.findMany({
      where: {
        userId: collector.id,
        status: { in: [TicketStatus.WAITING, TicketStatus.CALLED, TicketStatus.UNBOXING] },
      },
    });
    expect(activeTickets.length).toBe(1);

    // Verify atomic rollback: QueueCounter lastNumber MUST equal 1 (proves rollback under race)
    const counter = await prisma.queueCounter.findFirst({
      where: { seriesId: crySeries.id },
    });
    expect(counter?.lastNumber).toBe(1);
  });
});
