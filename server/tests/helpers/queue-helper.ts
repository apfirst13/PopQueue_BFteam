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

export interface TicketFixtureParams {
  userId: string;
  seriesId: string;
  queueNumber: number;
  displayNumber: string;
  status?: import('@prisma/client').TicketStatus;
  queueDate?: Date;
  createdAt?: Date;
  calledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  handledByStaffId?: string;
}

/**
 * Creates a raw ticket fixture in the database for integration test setups.
 */
export async function createTicketFixture(params: TicketFixtureParams) {
  const queueDate = params.queueDate ?? new Date();
  // Ensure date has no time component (Postgres DATE)
  const dateOnly = new Date(Date.UTC(queueDate.getUTCFullYear(), queueDate.getUTCMonth(), queueDate.getUTCDate()));

  return await prisma.queueTicket.create({
    data: {
      userId: params.userId,
      seriesId: params.seriesId,
      queueNumber: params.queueNumber,
      displayNumber: params.displayNumber,
      status: params.status ?? 'WAITING',
      queueDate: dateOnly,
      createdAt: params.createdAt ?? new Date(),
      calledAt: params.calledAt ?? null,
      startedAt: params.startedAt ?? null,
      completedAt: params.completedAt ?? null,
      handledByStaffId: params.handledByStaffId ?? null,
    },
  });
}

/**
 * Transitions a ticket to CALLED status with strict requirements:
 * Sets status=CALLED, calledAt=new Date(), and handledByStaffId (satisfying unique_active_staff_ticket).
 */
export async function transitionTicketToCalled(
  ticketId: string,
  handledByStaffId: string,
  calledAt: Date = new Date(),
) {
  return await prisma.queueTicket.update({
    where: { id: ticketId },
    data: {
      status: 'CALLED',
      calledAt,
      handledByStaffId,
    },
  });
}

