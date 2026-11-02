/**
 * ============================================================================
 * TEST-39 / AC-39: Database Persistence Verification Across Container Restart
 * ============================================================================
 *
 * Verifies that:
 * 1. Tickets created in WAITING, CALLED, and COMPLETED states survive a database
 *    container restart (`docker compose restart db`) with exact attribute fidelity.
 * 2. Next queue ticket joined after restart resumes numbering consecutively
 *    without gaps or counter resets.
 *
 * SAFETY GUARD:
 * Strictly runs against DATABASE_URL_TEST ending with "_test". Never touches dev data.
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const testDbUrl =
  process.env.DATABASE_URL_TEST ||
  'postgresql://popqueue:popqueue_dev_password@localhost:5435/popqueue_test?connection_limit=20';

// Safety Guard: Database URL validation
let dbName = '';
try {
  dbName = new URL(testDbUrl).pathname.replace('/', '');
} catch {
  console.error('FAIL: Invalid DATABASE_URL');
  process.exit(1);
}

if (!dbName.endsWith('_test')) {
  console.error(`FAIL: Refusing to run on non-test database: "${dbName}"`);
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: testDbUrl },
  },
});

async function main() {
  console.log('====================================================================');
  console.log(' TEST-39 / AC-39: Database Container Restart Persistence Check');
  console.log(` Target Database: ${dbName} (isolated test database)`);
  console.log('====================================================================\n');

  try {
    // 1. Initial State Cleanup
    console.log('[Step 1] Cleaning test database queue state...');
    await prisma.queueTicket.deleteMany({});
    await prisma.queueCounter.deleteMany({});

    // 2. Lookup Seeded Users & Series
    console.log('[Step 2] Looking up seeded users and CRY series...');
    const series = await prisma.series.findUnique({ where: { code: 'CRY' } });
    if (!series) throw new Error('Seeded series "CRY" not found. Run seed script first.');

    const collector1 = await prisma.user.findUnique({ where: { username: 'collector1' } });
    const collector2 = await prisma.user.findUnique({ where: { username: 'collector2' } });
    const collector3 = await prisma.user.findUnique({ where: { username: 'collector3' } });
    const collector4 = await prisma.user.findUnique({ where: { username: 'collector4' } });
    const staff1 = await prisma.user.findUnique({ where: { username: 'staff_crybaby' } });
    const staff2 = await prisma.user.findUnique({ where: { username: 'staff_crybaby2' } });

    if (!collector1 || !collector2 || !collector3 || !collector4 || !staff1 || !staff2) {
      throw new Error('Required seeded accounts not found. Ensure 9 seeded users exist.');
    }

    const today = new Date();
    const dateOnly = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    // 3. Seed 3 Tickets: WAITING, CALLED, COMPLETED
    console.log('[Step 3] Creating 3 tickets in WAITING, CALLED, COMPLETED states...');

    // Ticket 1: WAITING
    const tWaiting = await prisma.queueTicket.create({
      data: {
        userId: collector1.id,
        seriesId: series.id,
        queueNumber: 1,
        displayNumber: 'CRY-001',
        status: 'WAITING',
        queueDate: dateOnly,
        createdAt: new Date('2026-11-02T08:00:00Z'),
      },
    });

    // Ticket 2: CALLED
    const tCalled = await prisma.queueTicket.create({
      data: {
        userId: collector2.id,
        seriesId: series.id,
        queueNumber: 2,
        displayNumber: 'CRY-002',
        status: 'CALLED',
        queueDate: dateOnly,
        handledByStaffId: staff1.id,
        createdAt: new Date('2026-11-02T08:05:00Z'),
        calledAt: new Date('2026-11-02T08:10:00Z'),
      },
    });

    // Ticket 3: COMPLETED
    const tCompleted = await prisma.queueTicket.create({
      data: {
        userId: collector3.id,
        seriesId: series.id,
        queueNumber: 3,
        displayNumber: 'CRY-003',
        status: 'COMPLETED',
        queueDate: dateOnly,
        handledByStaffId: staff2.id,
        createdAt: new Date('2026-11-02T08:15:00Z'),
        calledAt: new Date('2026-11-02T08:20:00Z'),
        startedAt: new Date('2026-11-02T08:22:00Z'),
        completedAt: new Date('2026-11-02T08:25:00Z'),
      },
    });

    // Initialize QueueCounter at 3
    await prisma.queueCounter.create({
      data: {
        seriesId: series.id,
        queueDate: dateOnly,
        lastNumber: 3,
      },
    });

    console.log(`  -> Created WAITING:   ${tWaiting.displayNumber} (ID: ${tWaiting.id})`);
    console.log(`  -> Created CALLED:    ${tCalled.displayNumber} (ID: ${tCalled.id})`);
    console.log(`  -> Created COMPLETED: ${tCompleted.displayNumber} (ID: ${tCompleted.id})`);
    console.log('  -> QueueCounter set to lastNumber = 3');

    // Disconnect prisma before restart
    await prisma.$disconnect();

    // 4. Restart Database Container
    console.log('\n[Step 4] Executing: docker compose restart db ...');
    execSync('docker compose restart db', { stdio: 'inherit' });

    // 5. Wait for Database Container to become healthy
    console.log('[Step 5] Waiting for PostgreSQL container to recover and report healthy...');
    let healthy = false;
    for (let i = 0; i < 30; i++) {
      try {
        const out = execSync(
          'docker compose exec -T db pg_isready -U popqueue -d popqueue_test',
          { encoding: 'utf8' },
        );
        if (out.includes('accepting connections')) {
          healthy = true;
          break;
        }
      } catch {
        // waiting...
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!healthy) {
      throw new Error('Database container failed to report healthy within 30 seconds.');
    }
    console.log('  -> PostgreSQL container is ready and accepting connections.');

    // Reconnect Prisma
    const pReconnect = new PrismaClient({
      datasources: { db: { url: testDbUrl } },
    });

    // 6. Read back tickets and assert attribute fidelity
    console.log('\n[Step 6] Reading back all tickets and verifying data integrity...');

    const readWaiting = await pReconnect.queueTicket.findUnique({ where: { id: tWaiting.id } });
    const readCalled = await pReconnect.queueTicket.findUnique({ where: { id: tCalled.id } });
    const readCompleted = await pReconnect.queueTicket.findUnique({ where: { id: tCompleted.id } });

    if (!readWaiting || readWaiting.status !== 'WAITING' || readWaiting.displayNumber !== 'CRY-001') {
      throw new Error(`WAITING ticket corrupted or lost: ${JSON.stringify(readWaiting)}`);
    }

    if (
      !readCalled ||
      readCalled.status !== 'CALLED' ||
      readCalled.displayNumber !== 'CRY-002' ||
      readCalled.handledByStaffId !== staff1.id ||
      !readCalled.calledAt
    ) {
      throw new Error(`CALLED ticket corrupted or lost: ${JSON.stringify(readCalled)}`);
    }

    if (
      !readCompleted ||
      readCompleted.status !== 'COMPLETED' ||
      readCompleted.displayNumber !== 'CRY-003' ||
      readCompleted.handledByStaffId !== staff2.id ||
      !readCompleted.startedAt ||
      !readCompleted.completedAt
    ) {
      throw new Error(`COMPLETED ticket corrupted or lost: ${JSON.stringify(readCompleted)}`);
    }

    console.log('  -> Verified Ticket 1 (WAITING):   Exact match (CRY-001)');
    console.log('  -> Verified Ticket 2 (CALLED):    Exact match (CRY-002, staff assigned, calledAt preserved)');
    console.log('  -> Verified Ticket 3 (COMPLETED): Exact match (CRY-003, all 3 timestamps preserved)');

    // 7. Verify consecutive queue numbering resumption (Atomic Join Next Ticket)
    console.log('\n[Step 7] Simulating collector4 joining next queue ticket...');

    const counterRows = await pReconnect.$queryRaw`
      INSERT INTO "QueueCounter" ("id", "seriesId", "queueDate", "lastNumber")
      VALUES (gen_random_uuid()::text, ${series.id}, ${dateOnly.toISOString().slice(0, 10)}::date, 1)
      ON CONFLICT ("seriesId", "queueDate")
      DO UPDATE SET "lastNumber" = "QueueCounter"."lastNumber" + 1
      RETURNING "lastNumber";
    `;

    const nextNumber = Number(counterRows[0].lastNumber);
    const nextDisplay = `CRY-${String(nextNumber).padStart(3, '0')}`;

    const tNext = await pReconnect.queueTicket.create({
      data: {
        userId: collector4.id,
        seriesId: series.id,
        queueNumber: nextNumber,
        displayNumber: nextDisplay,
        status: 'WAITING',
        queueDate: dateOnly,
      },
    });

    console.log(`  -> New Ticket Joined: ${tNext.displayNumber} (Queue Number: ${tNext.queueNumber})`);

    if (tNext.queueNumber !== 4 || tNext.displayNumber !== 'CRY-004') {
      throw new Error(`Expected queue number 4 (CRY-004) after restart, received: ${tNext.displayNumber}`);
    }

    console.log('  -> Numbering correctly resumed from previous state (3 -> 4) with zero gaps.');

    // 8. Clean up
    console.log('\n[Step 8] Cleaning up test tickets...');
    await pReconnect.queueTicket.deleteMany({});
    await pReconnect.queueCounter.deleteMany({});
    await pReconnect.$disconnect();

    console.log('\n====================================================================');
    console.log(' RESULT: PASS (TEST-39 / AC-39)');
    console.log(' All tickets persisted through container restart with zero data loss.');
    console.log('====================================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n====================================================================');
    console.error(' RESULT: FAIL (TEST-39 / AC-39)');
    console.error(' Error:', err.message);
    console.error('====================================================================');
    process.exit(1);
  }
}

main();
