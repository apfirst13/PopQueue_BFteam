import { test, expect } from '@playwright/test';
import {
  resetTestDatabase,
  COLLECTOR_PASSWORD,
  STAFF_PASSWORD,
  getScreenshotPath,
} from './helpers/test-db.js';

test.describe('TEST-20 / AC-20: Mobile Viewport 375x667 Responsive Verification', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  });

  test.beforeEach(async () => {
    await resetTestDatabase();
  });

  test.afterAll(async () => {
    await resetTestDatabase();
  });

  test('verifies no horizontal overflow (scrollWidth <= clientWidth) across all Sprint 1 screens', async ({
    page,
  }) => {
    const assertNoHorizontalOverflow = async (screenName: string) => {
      const isOverflowing = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth;
      });
      expect(
        isOverflowing,
        `Screen "${screenName}" must not overflow horizontally on 375px viewport`,
      ).toBe(false);
    };

    // 1. Check /login
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('เข้าสู่ระบบ PopQueue');
    await assertNoHorizontalOverflow('/login');
    await page.screenshot({
      path: getScreenshotPath('ac20-responsive-375px-login.png'),
      fullPage: true,
    });

    // 2. Check /series as logged-in collector
    await page.fill('#username-input', 'collector1');
    await page.fill('#password-input', COLLECTOR_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/series/);
    await assertNoHorizontalOverflow('/series');
    await page.screenshot({
      path: getScreenshotPath('ac20-responsive-375px-series.png'),
      fullPage: true,
    });

    // 3. Join queue to reach /my-ticket
    const cryJoinBtn = page.locator('.card[data-series="CRY"] button', {
      hasText: 'เข้าคิว (Join Queue)',
    });
    await cryJoinBtn.click();
    await expect(page).toHaveURL(/\/my-ticket/);
    await expect(page.locator('h2')).toContainText('บัตรคิวของคุณ');
    await assertNoHorizontalOverflow('/my-ticket');
    await page.screenshot({
      path: getScreenshotPath('ac20-responsive-375px-my-ticket.png'),
      fullPage: true,
    });

    // 4. Check /staff/counter as Box Master
    // Clear localStorage and log in as staff_crybaby
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
    await page.fill('#username-input', 'staff_crybaby');
    await page.fill('#password-input', STAFF_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/staff\/counter/);
    await expect(page.locator('h2')).toContainText('เคาน์เตอร์บริการ (Staff Counter)');
    await assertNoHorizontalOverflow('/staff/counter');
    await page.screenshot({
      path: getScreenshotPath('ac20-responsive-375px-staff-counter.png'),
      fullPage: true,
    });
  });
});
