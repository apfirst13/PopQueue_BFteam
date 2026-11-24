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

    const statusBadge = page.locator('.card .badge');
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

  test('TEST-19 (Extended, BR-02 v2): collector joins CRY then LAB, sees both active cards on /my-ticket, and still gets DUPLICATE_ACTIVE_QUEUE on CRY retry', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.fill('#username-input', 'collector1');
    await page.fill('#password-input', COLLECTOR_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/series/);

    // 1. Join CRY
    await page.locator('.card[data-series="CRY"] button', { hasText: 'เข้าคิว (Join Queue)' }).click();
    await expect(page).toHaveURL(/\/my-ticket/);
    await expect(page.locator('.card[data-series="CRY"]')).toContainText('CRY-001');

    // 2. Navigate back to /series and join LAB
    await page.goto('/series');
    await expect(page.locator('h2')).toContainText('รายการซีรีส์');
    await page.locator('.card[data-series="LAB"] button', { hasText: 'เข้าคิว (Join Queue)' }).click();
    await expect(page).toHaveURL(/\/my-ticket/);

    // 3. Both active cards render ordered CRY then LAB
    const cards = page.locator('.virtual-ticket-card');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toHaveAttribute('data-series', 'CRY');
    await expect(cards.nth(0)).toContainText('CRY-001');
    await expect(cards.nth(0).locator('.badge')).toHaveText('WAITING');
    await expect(cards.nth(1)).toHaveAttribute('data-series', 'LAB');
    await expect(cards.nth(1)).toContainText('LAB-001');
    await expect(cards.nth(1).locator('.badge')).toHaveText('WAITING');

    await page.screenshot({
      path: getScreenshotPath('ac19-multi-series-my-ticket.png'),
      fullPage: true,
    });

    // 4. Retry CRY -> rejected with 409 DUPLICATE_ACTIVE_QUEUE
    await page.goto('/series');
    await page.locator('.card[data-series="CRY"] button', { hasText: 'เข้าคิว (Join Queue)' }).click();
    const errorAlert = page.locator('.alert-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('DUPLICATE_ACTIVE_QUEUE');
  });
});
