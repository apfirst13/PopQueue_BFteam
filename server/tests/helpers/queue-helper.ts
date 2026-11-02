import { prisma } from '../../src/config/db.js';

/**
 * Resets all tickets and counters in the test database, and removes temporary synthetic users.
 * Guarantees a clean queue state for isolated test execution.
 *
 * SAFETY GUARD: Parses database name from DATABASE_URL and refuses execution unless
 * the database name strictly ends with "_test". Never prints full URL to prevent credential leakage.
 */
export async function resetQueueState(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL ?? '';
  let dbName = '';
  try {
    dbName = new URL(dbUrl).pathname.replace('/', '');
  } catch {
    throw new Error('resetQueueState() refused: invalid or missing DATABASE_URL');
  }

  if (!dbName.endsWith('_test')) {
    throw new Error(`resetQueueState() refused: database "${dbName}" is not a test database`);
  }

  await prisma.queueTicket.deleteMany({});
  await prisma.queueCounter.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      username: {
        startsWith: 'synthetic_collector_',
      },
    },
  });
}
