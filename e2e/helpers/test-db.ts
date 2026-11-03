import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

const cwd = process.cwd();
const rootDir = cwd.endsWith('e2e') ? path.resolve(cwd, '..') : cwd;
dotenv.config({ path: path.resolve(rootDir, '.env') });

export function getScreenshotPath(filename: string): string {
  return path.resolve(rootDir, 'docs/evidence/screenshots', filename);
}

const testDbUrl =
  process.env.DATABASE_URL_TEST ||
  process.env.DATABASE_URL ||
  'postgresql://popqueue:popqueue_dev_password@localhost:5432/popqueue_test?connection_limit=20';

export const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: testDbUrl,
    },
  },
});

export const COLLECTOR_PASSWORD =
  process.env.SEED_COLLECTOR_PASSWORD || 'collector_dev_password123';
export const STAFF_PASSWORD =
  process.env.SEED_STAFF_PASSWORD || 'staff_dev_password123';

/**
 * Resets the queue state in the test database for isolated test execution.
 * SAFETY GUARD: strictly verifies database name ends with "_test".
 */
export async function resetTestDatabase(): Promise<void> {
  let dbName = '';
  try {
    dbName = new URL(testDbUrl).pathname.replace('/', '');
  } catch {
    throw new Error('resetTestDatabase() refused: invalid DATABASE_URL');
  }

  if (!dbName.endsWith('_test')) {
    throw new Error(`resetTestDatabase() refused: database "${dbName}" is not a test database!`);
  }

  await testPrisma.queueTicket.deleteMany({});
  await testPrisma.queueCounter.deleteMany({});
  await testPrisma.user.deleteMany({
    where: {
      username: {
        startsWith: 'synthetic_',
      },
    },
  });
}
