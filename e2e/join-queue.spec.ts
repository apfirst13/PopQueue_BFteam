import { test, expect } from '@playwright/test';
import {
  resetTestDatabase,
  COLLECTOR_PASSWORD,
  getScreenshotPath,
} from './helpers/test-db.js';

test.describe('TEST-19 / AC-19: Collector Queue Join & Duplicate Active Queue Rejection', () => {
  test.beforeEach(async () => {
    await resetTestDatabase();
  });

  test.afterAll(async () => {
    await resetTestDatabase();
  });

  test('collector logs in, joins CRY queue, verifies WAITING ticket, and verifies duplicate rejection', async ({
    page,
  }) => {
    // 1. Visit Login page
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('เข้าสู่ระบบ PopQueue');

    // 2. Log in as collector1
    await page.fill('#username-input', 'collector1');
    await page.fill('#password-input', COLLECTOR_PASSWORD);
    await page.click('button[type="submit"]');

    // 3. Should navigate to /series because collector has no active ticket
    await expect(page).toHaveURL(/\/series/);
    await expect(page.locator('h2')).toContainText('รายการซีรีส์');

    // 4. Locate Crybaby series card and join queue
    const cryCard = page.locator('.card[data-series="CRY"]');
    await expect(cryCard).toBeVisible();
    await expect(cryCard).toContainText('Crybaby Sunset Concert');

    const joinButton = cryCard.locator('button', { hasText: 'เข้าคิว (Join Queue)' });
    await expect(joinButton).toBeEnabled();
    await joinButton.click();

    // 5. Should be redirected to /my-ticket with ticket details
    await expect(page).toHaveURL(/\/my-ticket/);
    await expect(page.locator('h2')).toContainText('บัตรคิวของคุณ');

    // Verify ticket number and WAITING status
    const ticketNumber = page.locator('div[style*="font-size: 2.5rem"], div[style*="font-size:2.5rem"]');
    await expect(ticketNumber).toBeVisible();
    await expect(ticketNumber).toContainText('CRY-001');

    const statusBadge = page.locator('.badge');
    await expect(statusBadge).toHaveText('WAITING');
    await expect(page.locator('text=เหลืออีก 0 คิวก่อนหน้า')).toBeVisible();

    // Screenshot of successful join
    await page.screenshot({
      path: getScreenshotPath('ac19-join-success-waiting.png'),
      fullPage: true,
    });

    // 6. Attempt duplicate join: navigate back to /series
    await page.goto('/series');
    await expect(page.locator('h2')).toContainText('รายการซีรีส์');

    // Attempt to join Crybaby series again
    const cryJoinAgain = page.locator('.card[data-series="CRY"] button', {
      hasText: 'เข้าคิว (Join Queue)',
    });
    await cryJoinAgain.click();

    // 7. Verify business-rule rejection alert DUPLICATE_ACTIVE_QUEUE is displayed in UI
    const errorAlert = page.locator('.alert-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('DUPLICATE_ACTIVE_QUEUE');

    // Screenshot of duplicate rejection
    await page.screenshot({
      path: getScreenshotPath('ac19-duplicate-rejection-error.png'),
      fullPage: true,
    });
  });
});
