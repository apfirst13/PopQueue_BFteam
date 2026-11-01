import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';
import {
  SEED_COLLECTOR_PASSWORD,
  SEED_STAFF_PASSWORD,
} from '../helpers/auth-helper.js';

const prisma = new PrismaClient();

describe('Security: Password Hash Characterization (TEST-07, AC-07, NFR-01)', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('verifies that all seeded accounts have secure bcrypt password hashes with cost >= 10', async () => {
    const users = await prisma.user.findMany();
    expect(users.length).toBe(9);

    const bcryptRegex = /^\$2[aby]\$(\d{2})\$[./A-Za-z0-9]{53}$/;

    for (const user of users) {
      // 1. Matches Bcrypt structure
      const match = user.passwordHash.match(bcryptRegex);
      expect(match).not.toBeNull();

      // 2. Cost parameter >= 10
      const cost = parseInt(match![1], 10);
      expect(cost).toBeGreaterThanOrEqual(10);

      // 3. Never equal to plaintext
      expect(user.passwordHash).not.toBe(SEED_COLLECTOR_PASSWORD);
      expect(user.passwordHash).not.toBe(SEED_STAFF_PASSWORD);

      // 4. Compares successfully with seeded credentials
      const expectedPassword =
        user.role === Role.BOX_MASTER
          ? SEED_STAFF_PASSWORD
          : SEED_COLLECTOR_PASSWORD;

      const isValid = bcrypt.compareSync(expectedPassword, user.passwordHash);
      expect(isValid).toBe(true);
    }
  });
});
