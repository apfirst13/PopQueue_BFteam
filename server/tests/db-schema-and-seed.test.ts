import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient, Role, TicketStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seed } from '../prisma/seed.js';
import { getQueueDateAsDate } from '../src/utils/clock.js';

describe('Database Schema, Models, Partial Indexes & Seed Verification (Issue I-01)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await seed();
  });

  afterAll(async () => {
    // Clean up test tickets
    await prisma.queueTicket.deleteMany();
    await prisma.queueCounter.deleteMany();
    await prisma.$disconnect();
  });

  it('Seeds 9 users with valid bcrypt cost >= 10 and correct roles (NFR-01, AC-07)', async () => {
    const users = await prisma.user.findMany({
      orderBy: { username: 'asc' },
    });

    expect(users).toHaveLength(9);

    const collectors = users.filter((u) => u.role === Role.COLLECTOR);
    const staff = users.filter((u) => u.role === Role.BOX_MASTER);

    expect(collectors).toHaveLength(6);
    expect(staff).toHaveLength(3);

    for (const user of users) {
      // Check bcrypt hash format: $2a$10$... or $2b$10$...
      const match = user.passwordHash.match(/^\$2[aby]\$(\d{2})\$/);
      expect(match).not.toBeNull();
      const cost = parseInt(match![1], 10);
      expect(cost).toBeGreaterThanOrEqual(10);

      // Verify password compare works
      const expectedPassword =
        user.role === Role.COLLECTOR ? 'collector_dev_password123' : 'staff_dev_password123';
      const isValid = await bcrypt.compare(expectedPassword, user.passwordHash);
      expect(isValid).toBe(true);
    }
  });

  it('Seeds 3 series with correct active flags and codes', async () => {
    const seriesList = await prisma.series.findMany({
      orderBy: { code: 'asc' },
    });

    expect(seriesList).toHaveLength(3);

    const cry = seriesList.find((s) => s.code === 'CRY');
    const lab = seriesList.find((s) => s.code === 'LAB');
    const skp = seriesList.find((s) => s.code === 'SKP');

    expect(cry).toBeDefined();
    expect(cry?.isActive).toBe(true);

    expect(lab).toBeDefined();
    expect(lab?.isActive).toBe(true);

    expect(skp).toBeDefined();
    expect(skp?.isActive).toBe(false);
  });

  it('Seeds 3 staff series assignments correctly', async () => {
    const assignments = await prisma.staffSeriesAssignment.findMany({
      include: {
        staff: true,
        series: true,
      },
    });

    expect(assignments).toHaveLength(3);

    const mapped = assignments.map((a) => `${a.staff.username}->${a.series.code}`);
    expect(mapped).toContain('staff_crybaby->CRY');
    expect(mapped).toContain('staff_crybaby2->CRY');
    expect(mapped).toContain('staff_labubu->LAB');
  });

  it('Seed script is idempotent (can run multiple times without duplicating)', async () => {
    await seed();

    const userCount = await prisma.user.count();
    const seriesCount = await prisma.series.count();
    const assignmentCount = await prisma.staffSeriesAssignment.count();

    expect(userCount).toBe(9);
    expect(seriesCount).toBe(3);
    expect(assignmentCount).toBe(3);
  });

  it('Enforces partial unique index unique_active_ticket_user (BR-02)', async () => {
    const collector = await prisma.user.findUniqueOrThrow({
      where: { username: 'collector1' },
    });
    const crySeries = await prisma.series.findUniqueOrThrow({
      where: { code: 'CRY' },
    });
    const labSeries = await prisma.series.findUniqueOrThrow({
      where: { code: 'LAB' },
    });

    const queueDate = getQueueDateAsDate();

    // Create 1st active ticket for collector1
    const ticket1 = await prisma.queueTicket.create({
      data: {
        seriesId: crySeries.id,
        userId: collector.id,
        queueDate,
        queueNumber: 101,
        displayNumber: 'CRY-101',
        status: TicketStatus.WAITING,
      },
    });
    expect(ticket1.id).toBeDefined();

    // Attempting to create a 2nd active ticket for the same user must be rejected by unique_active_ticket_user
    await expect(
      prisma.queueTicket.create({
        data: {
          seriesId: labSeries.id,
          userId: collector.id,
          queueDate,
          queueNumber: 102,
          displayNumber: 'LAB-102',
          status: TicketStatus.WAITING,
        },
      })
    ).rejects.toThrow();

    // Clean up
    await prisma.queueTicket.deleteMany({ where: { userId: collector.id } });
  });

  it('Enforces partial unique index unique_active_staff_ticket (BR-06)', async () => {
    const staff = await prisma.user.findUniqueOrThrow({
      where: { username: 'staff_crybaby' },
    });
    const collector1 = await prisma.user.findUniqueOrThrow({
      where: { username: 'collector2' },
    });
    const collector2 = await prisma.user.findUniqueOrThrow({
      where: { username: 'collector3' },
    });
    const crySeries = await prisma.series.findUniqueOrThrow({
      where: { code: 'CRY' },
    });

    const queueDate = getQueueDateAsDate();

    // Staff handles ticket 1 in CALLED status
    const ticket1 = await prisma.queueTicket.create({
      data: {
        seriesId: crySeries.id,
        userId: collector1.id,
        handledByStaffId: staff.id,
        queueDate,
        queueNumber: 201,
        displayNumber: 'CRY-201',
        status: TicketStatus.CALLED,
        calledAt: new Date(),
      },
    });
    expect(ticket1.id).toBeDefined();

    // Attempting to assign another ticket in UNBOXING/CALLED to the same staff must be rejected by unique_active_staff_ticket
    await expect(
      prisma.queueTicket.create({
        data: {
          seriesId: crySeries.id,
          userId: collector2.id,
          handledByStaffId: staff.id,
          queueDate,
          queueNumber: 202,
          displayNumber: 'CRY-202',
          status: TicketStatus.UNBOXING,
          calledAt: new Date(),
          startedAt: new Date(),
        },
      })
    ).rejects.toThrow();

    // Clean up
    await prisma.queueTicket.deleteMany({
      where: { id: { in: [ticket1.id] } },
    });
  });
});
