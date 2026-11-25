import { test, expect } from '@playwright/test';
import {
  resetTestDatabase,
  testPrisma,
  COLLECTOR_PASSWORD,
} from './helpers/test-db.js';

test.describe('F-05 / D2-I6: Collector Cancel -> Re-join E2E Flow', () => {
  test.beforeEach(async () => {
    await resetTestDatabase();
    await testPrisma.series.updateMany({ where: { code: { in: ['CRY', 'LAB'] } }, data: { isActive: true } });
    await testPrisma.series.updateMany({ where: { code: 'SKP' }, data: { isActive: false } });
  });

  test.afterAll(async () => {
    await resetTestDatabase();
  });

  test('collector joins CRY-001, cancels via confirmation modal, sees clean empty state, and immediately re-joins CRY-002', async ({
    page,
  }) => {
    // 1. Login as collector1
    await page.goto('/login');
    await page.fill('#username-input', 'collector1');
    await page.fill('#password-input', COLLECTOR_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/series/);

    // 2. Join CRY -> CRY-001
    await page.locator('.card[data-series="CRY"] button', { hasText: 'เข้าคิว (Join Queue)' }).click();
    await expect(page).toHaveURL(/\/my-ticket/);

    const cryCard = page.locator('.virtual-ticket-card[data-series="CRY"]');
    await expect(cryCard).toContainText('CRY-001');
    await expect(cryCard.locator('.badge')).toHaveText('WAITING');

    // 3. Open Cancel Confirmation Modal and confirm cancellation
    await cryCard.getByRole('button', { name: 'ยกเลิกคิว' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('ยืนยันการยกเลิกคิว');
    await expect(dialog).toContainText('CRY-001');

    await dialog.getByRole('button', { name: 'ยืนยันยกเลิกคิว' }).click();

    // 4. Verify toast, clean empty state (no red error alert), and no active ticket card
    await expect(page.getByRole('status')).toContainText('ยกเลิกคิวสำเร็จ');
    await expect(page.getByRole('heading', { name: 'ยังไม่มีบัตรคิว' })).toBeVisible();
    await expect(page.locator('.alert-error')).toHaveCount(0);

    // 5. Navigate back to /series via empty-state CTA and re-join CRY -> CRY-002 (monotonic non-reuse)
    await page.getByRole('link', { name: 'เลือกซีรีส์และรับบัตรคิว' }).click();
    await expect(page).toHaveURL(/\/series/);

    await page.locator('.card[data-series="CRY"] button', { hasText: 'เข้าคิว (Join Queue)' }).click();
    await expect(page).toHaveURL(/\/my-ticket/);

    const newCryCard = page.locator('.virtual-ticket-card[data-series="CRY"]');
    await expect(newCryCard).toContainText('CRY-002');
    await expect(newCryCard.locator('.badge')).toHaveText('WAITING');

    // 6. Verify DB state: CRY-001 CANCELLED with forfeitedAt, CRY-002 WAITING
    const tickets = await testPrisma.queueTicket.findMany({
      where: { displayNumber: { in: ['CRY-001', 'CRY-002'] } },
      orderBy: { queueNumber: 'asc' },
    });
    expect(tickets).toHaveLength(2);
    expect(tickets[0].displayNumber).toBe('CRY-001');
    expect(tickets[0].status).toBe('CANCELLED');
    expect(tickets[0].forfeitedAt).not.toBeNull();
    expect(tickets[1].displayNumber).toBe('CRY-002');
    expect(tickets[1].status).toBe('WAITING');
  });
});
