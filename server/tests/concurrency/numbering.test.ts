import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/db.js';
import { resetQueueState } from '../helpers/queue-helper.js';
import { signTestToken } from '../helpers/auth-helper.js';
import { Role } from '@prisma/client';

describe('Concurrency: Safe Sequential Numbering (TEST-15, AC-15, BR-01, NFR-03)', () => {
  beforeEach(async () => {
    await resetQueueState();
  });

  afterAll(async () => {
    await resetQueueState();
  });

  it('TEST-15: 50 concurrent distinct collectors receive sequential numbers 1..50 with zero gaps and zero duplicates', async () => {
    const crySeries = await prisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });
    const userCount = 50;

    // 1. Arrange: Create 50 synthetic collectors in batch (fast insertion)
    const syntheticUsersData = Array.from({ length: userCount }, (_, i) => ({
      username: `synthetic_collector_num_${i + 1}`,
      passwordHash: '$2a$10$syntheticHashForSpeedyTestingOnlyXXXXXXXXXXXXX',
      fullName: `Synthetic Collector ${i + 1}`,
      role: Role.COLLECTOR,
      tokenVersion: 0,
    }));

    await prisma.user.createMany({
      data: syntheticUsersData,
      skipDuplicates: true,
    });

    const createdUsers = await prisma.user.findMany({
      where: { username: { startsWith: 'synthetic_collector_num_' } },
      orderBy: { username: 'asc' },
    });
    expect(createdUsers.length).toBe(userCount);

    // Generate JWT tokens directly without HTTP login overhead
    const userTokens = createdUsers.map((u) => signTestToken(u.id, u.role, u.tokenVersion));

    // 2. Act: Fire 50 simultaneous join requests using Promise.all
    const joinPromises = userTokens.map((token) =>
      request(app)
        .post('/api/tickets/join')
        .set('Authorization', `Bearer ${token}`)
        .send({ seriesId: crySeries.id }),
    );

    const responses = await Promise.all(joinPromises);

    // 3. Assert
    // Every single request must succeed with 201 Created
    for (const res of responses) {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('data');
    }

    // Collect all queueNumbers
    const receivedNumbers: number[] = responses.map((r) => r.body.data.queueNumber);
    expect(receivedNumbers.length).toBe(userCount);

    // Sort received numbers
    receivedNumbers.sort((a, b) => a - b);

    // Verify: Strictly sequential from 1 to 50 with ZERO duplicates and ZERO gaps
    const expectedNumbers = Array.from({ length: userCount }, (_, i) => i + 1);
    expect(receivedNumbers).toEqual(expectedNumbers);

    // Verify set size matches userCount (no duplicates)
    const uniqueNumbers = new Set(receivedNumbers);
    expect(uniqueNumbers.size).toBe(userCount);

    // Verify database QueueCounter state
    const counter = await prisma.queueCounter.findFirst({
      where: { seriesId: crySeries.id },
    });
    expect(counter).not.toBeNull();
    expect(counter?.lastNumber).toBe(userCount);

    // Verify total ticket count in DB
    const dbTicketCount = await prisma.queueTicket.count({
      where: { seriesId: crySeries.id },
    });
    expect(dbTicketCount).toBe(userCount);
  });
});
