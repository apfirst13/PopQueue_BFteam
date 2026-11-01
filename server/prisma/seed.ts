import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export async function seed() {
  const bcryptCost = Number(process.env.BCRYPT_COST) || 10;
  const collectorPassword = process.env.SEED_COLLECTOR_PASSWORD || 'collector_dev_password123';
  const staffPassword = process.env.SEED_STAFF_PASSWORD || 'staff_dev_password123';

  const collectorHash = await bcrypt.hash(collectorPassword, bcryptCost);
  const staffHash = await bcrypt.hash(staffPassword, bcryptCost);

  // 1. Seed 9 Users (6 Collectors, 3 Box Masters)
  const usersData = [
    { username: 'collector1', fullName: 'Collector 1', role: Role.COLLECTOR, passwordHash: collectorHash },
    { username: 'collector2', fullName: 'Collector 2', role: Role.COLLECTOR, passwordHash: collectorHash },
    { username: 'collector3', fullName: 'Collector 3', role: Role.COLLECTOR, passwordHash: collectorHash },
    { username: 'collector4', fullName: 'Collector 4', role: Role.COLLECTOR, passwordHash: collectorHash },
    { username: 'collector5', fullName: 'Collector 5', role: Role.COLLECTOR, passwordHash: collectorHash },
    { username: 'collector6', fullName: 'Collector 6', role: Role.COLLECTOR, passwordHash: collectorHash },
    { username: 'staff_crybaby', fullName: 'Staff Crybaby', role: Role.BOX_MASTER, passwordHash: staffHash },
    { username: 'staff_crybaby2', fullName: 'Staff Crybaby 2', role: Role.BOX_MASTER, passwordHash: staffHash },
    { username: 'staff_labubu', fullName: 'Staff Labubu', role: Role.BOX_MASTER, passwordHash: staffHash },
  ];

  const userMap = new Map<string, string>();
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {
        fullName: u.fullName,
        role: u.role,
        passwordHash: u.passwordHash,
      },
      create: {
        username: u.username,
        fullName: u.fullName,
        role: u.role,
        passwordHash: u.passwordHash,
      },
    });
    userMap.set(u.username, user.id);
  }

  // 2. Seed 3 Series (CRY, LAB, SKP)
  const seriesData = [
    { code: 'CRY', name: 'Crybaby Sunset Concert', isActive: true },
    { code: 'LAB', name: 'Labubu Macaron', isActive: true },
    { code: 'SKP', name: 'Skullpanda Closed Demo', isActive: false },
  ];

  const seriesMap = new Map<string, string>();
  for (const s of seriesData) {
    const series = await prisma.series.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        isActive: s.isActive,
      },
      create: {
        code: s.code,
        name: s.name,
        isActive: s.isActive,
      },
    });
    seriesMap.set(s.code, series.id);
  }

  // 3. Seed 3 Staff Series Assignments
  const assignments = [
    { staffUsername: 'staff_crybaby', seriesCode: 'CRY' },
    { staffUsername: 'staff_crybaby2', seriesCode: 'CRY' },
    { staffUsername: 'staff_labubu', seriesCode: 'LAB' },
  ];

  for (const a of assignments) {
    const staffId = userMap.get(a.staffUsername);
    const seriesId = seriesMap.get(a.seriesCode);
    if (!staffId || !seriesId) continue;

    await prisma.staffSeriesAssignment.upsert({
      where: {
        staffId_seriesId: {
          staffId,
          seriesId,
        },
      },
      update: {},
      create: {
        staffId,
        seriesId,
      },
    });
  }

  console.log('Seeding completed successfully: 9 Users, 3 Series, 3 Assignments.');
}

if (process.env.NODE_ENV !== 'test') {
  seed()
    .catch((e) => {
      console.error('Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
