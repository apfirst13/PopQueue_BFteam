import { test, expect } from '@playwright/test';
import {
  resetTestDatabase,
  testPrisma,
  COLLECTOR_PASSWORD,
  STAFF_PASSWORD,
  getScreenshotPath,
} from './helpers/test-db.js';

test.describe('TEST-33 / AC-33: Multi-Context Full Journey & Live Polling Transition', () => {
  test.beforeEach(async () => {
    await resetTestDatabase();
  });

  test.afterAll(async () => {
    await resetTestDatabase();
  });

  test('Demo 1: Normal Domain Journey across Collector and Staff browser contexts with 3s polling', async ({
    browser,
  }) => {
    // -------------------------------------------------------------
    // CONTEXT 1: Collector
    // -------------------------------------------------------------
    const collectorContext = await browser.newContext();
    const collectorPage = await collectorContext.newPage();

    // 1. Collector Login
    await collectorPage.goto('/login');
    await collectorPage.fill('#username-input', 'collector1');
    await collectorPage.fill('#password-input', COLLECTOR_PASSWORD);
    await collectorPage.click('button[type="submit"]');

    await expect(collectorPage).toHaveURL(/\/series/);

    // 2. Join Crybaby Queue
    const cryJoinBtn = collectorPage.locator('.card[data-series="CRY"] button', {
      hasText: 'เข้าคิว (Join Queue)',
    });
    await cryJoinBtn.click();

    await expect(collectorPage).toHaveURL(/\/my-ticket/);
    await expect(collectorPage.locator('h2')).toContainText('บัตรคิวของคุณ');
    await expect(collectorPage.locator('.badge')).toHaveText('WAITING');
    await expect(collectorPage.locator('text=CRY-001')).toBeVisible();

    // Screenshot: Collector Waiting
    await collectorPage.screenshot({
      path: getScreenshotPath('demo1-step1-collector-waiting.png'),
      fullPage: true,
    });

    // -------------------------------------------------------------
    // CONTEXT 2: Staff Member (Box Master)
    // -------------------------------------------------------------
    const staffContext = await browser.newContext();
    const staffPage = await staffContext.newPage();

    // 3. Staff Login
    await staffPage.goto('/login');
    await staffPage.fill('#username-input', 'staff_crybaby');
    await staffPage.fill('#password-input', STAFF_PASSWORD);
    await staffPage.click('button[type="submit"]');

    await expect(staffPage).toHaveURL(/\/staff\/counter/);
    await expect(staffPage.locator('h2')).toContainText('เคาน์เตอร์บริการ (Staff Counter)');

    // Verify waiting queue displays CRY-001
    await expect(staffPage.locator('text=CRY-001')).toBeVisible();

    // 4. Staff Calls Next
    const callNextBtn = staffPage.locator('button', { hasText: 'เรียกคิวถัดไป (Call Next)' });
    await expect(callNextBtn).toBeEnabled();
    await callNextBtn.click();

    // Staff screen shows Current Serving CALLED
    const servingCard = staffPage.locator('.card', { hasText: 'กำลังให้บริการ (Current Serving)' });
    await expect(servingCard).toContainText('CRY-001');
    await expect(servingCard.locator('.badge')).toHaveText('CALLED');

    // Screenshot: Staff Called
    await staffPage.screenshot({
      path: getScreenshotPath('demo1-step2-staff-called.png'),
      fullPage: true,
    });

    // 5. Collector Page reflects CALLED via 3s polling WITHOUT reload
    await expect(collectorPage.locator('.badge')).toHaveText('CALLED', { timeout: 10000 });
    await expect(collectorPage.locator('.countdown-timer')).toBeVisible();
    await expect(collectorPage.locator('text=ถึงคิวแล้ว กรุณามาที่เคาน์เตอร์')).toBeVisible();

    // Screenshot: Collector Called (reflected live)
    await collectorPage.screenshot({
      path: getScreenshotPath('demo1-step3-collector-called.png'),
      fullPage: true,
    });

    // 6. Staff verifies & starts unboxing
    const startBtn = staffPage.locator('button', { hasText: 'Verify & Start Unboxing' });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    await expect(servingCard.locator('.badge')).toHaveText('UNBOXING');

    // Screenshot: Staff Unboxing
    await staffPage.screenshot({
      path: getScreenshotPath('demo1-step4-staff-unboxing.png'),
      fullPage: true,
    });

    // 7. Collector Page reflects UNBOXING via 3s polling
    await expect(collectorPage.locator('.badge')).toHaveText('UNBOXING', { timeout: 10000 });
    await expect(collectorPage.locator('text=กำลังให้บริการ')).toBeVisible();

    // Screenshot: Collector Unboxing
    await collectorPage.screenshot({
      path: getScreenshotPath('demo1-step5-collector-unboxing.png'),
      fullPage: true,
    });

    // 8. Staff completes ticket
    const completeBtn = staffPage.locator('button', { hasText: 'เสร็จสิ้น (Complete)' });
    await expect(completeBtn).toBeVisible();
    await completeBtn.click();

    // Serving resets to empty
    await expect(servingCard).toContainText('ยังไม่มีคิวที่กำลังให้บริการ');

    // Screenshot: Staff Completed
    await staffPage.screenshot({
      path: getScreenshotPath('demo1-step6-staff-completed.png'),
      fullPage: true,
    });

    // 9. Collector Page reflects COMPLETED via polling
    await expect(collectorPage.locator('.badge')).toHaveText('COMPLETED', { timeout: 10000 });
    await expect(collectorPage.locator('text=การให้บริการเสร็จสิ้นแล้ว')).toBeVisible();

    // 10. Reload Collector page - still displays COMPLETED state and action to join new ticket
    await collectorPage.reload();
    await expect(collectorPage.locator('.badge')).toHaveText('COMPLETED');
    await expect(collectorPage.locator('text=การให้บริการเสร็จสิ้นแล้ว')).toBeVisible();

    // Screenshot: Collector Completed & Reloaded
    await collectorPage.screenshot({
      path: getScreenshotPath('demo1-step7-collector-completed-reloaded.png'),
      fullPage: true,
    });

    // 11. Assert DB Record Integrity
    const savedTicket = await testPrisma.queueTicket.findFirst({
      where: { displayNumber: 'CRY-001' },
    });
    expect(savedTicket).not.toBeNull();
    expect(savedTicket?.status).toBe('COMPLETED');
    expect(savedTicket?.handledByStaffId).not.toBeNull();
    expect(savedTicket?.calledAt).not.toBeNull();
    expect(savedTicket?.startedAt).not.toBeNull();
    expect(savedTicket?.completedAt).not.toBeNull();

    // Validate Chronological Order: calledAt <= startedAt <= completedAt
    if (savedTicket?.calledAt && savedTicket?.startedAt && savedTicket?.completedAt) {
      expect(savedTicket.calledAt.getTime()).toBeLessThanOrEqual(savedTicket.startedAt.getTime());
      expect(savedTicket.startedAt.getTime()).toBeLessThanOrEqual(savedTicket.completedAt.getTime());
    }

    await collectorContext.close();
    await staffContext.close();
  });

  test('Demo 2: Business-Rule Rejections (Duplicate active ticket & closed series in UI)', async ({
    page,
  }) => {
    // 1. Collector2 logs in and joins queue
    await page.goto('/login');
    await page.fill('#username-input', 'collector2');
    await page.fill('#password-input', COLLECTOR_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/series/);

    const cryJoinBtn = page.locator('.card[data-series="CRY"] button', {
      hasText: 'เข้าคิว (Join Queue)',
    });
    await cryJoinBtn.click();
    await expect(page).toHaveURL(/\/my-ticket/);

    // 2. Return to /series and try joining CRY again (Duplicate Active Queue)
    await page.goto('/series');
    await expect(page.locator('h2')).toContainText('รายการซีรีส์');

    const cryJoinAgain = page.locator('.card[data-series="CRY"] button', {
      hasText: 'เข้าคิว (Join Queue)',
    });
    await cryJoinAgain.click();

    // Error Alert DUPLICATE_ACTIVE_QUEUE is visible
    const alert = page.locator('.alert-error');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('DUPLICATE_ACTIVE_QUEUE');

    await page.screenshot({
      path: getScreenshotPath('demo2-step1-duplicate-error.png'),
      fullPage: true,
    });

    // 3. Inspect Closed Series SKP (Skullpanda)
    const skpCard = page.locator('.card[data-series="SKP"]');
    await expect(skpCard).toBeVisible();
    await expect(skpCard).toContainText('ปิดรับคิว');

    const skpButton = skpCard.locator('button');
    await expect(skpButton).toBeDisabled();
    await expect(skpButton).toHaveText('ปิดรับคิว');

    await page.screenshot({
      path: getScreenshotPath('demo2-step2-closed-series.png'),
      fullPage: true,
    });
  });

  test('Demo 3: Access Control Guard and Logout Session Revocation', async ({
    page,
  }) => {
    // 1. Log in as collector1
    await page.goto('/login');
    await page.fill('#username-input', 'collector1');
    await page.fill('#password-input', COLLECTOR_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/series/);

    // 2. Collector attempts to access staff protected route /staff/counter
    await page.goto('/staff/counter');

    // Route guard redirects or displays Forbidden 403 page
    await expect(page).toHaveURL(/\/forbidden/);
    await expect(page.locator('h2')).toContainText('403 - ไม่มีสิทธิ์เข้าถึง');
    await expect(page.locator('text=คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้')).toBeVisible();

    await page.screenshot({
      path: getScreenshotPath('demo3-step1-forbidden-collector.png'),
      fullPage: true,
    });

    // 3. Logout
    const logoutBtn = page.locator('button', { hasText: 'ออกจากระบบ (Sign Out)' });
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Should redirect to /login
    await expect(page).toHaveURL(/\/login/);

    // 4. Verify protected route is no longer accessible
    await page.goto('/my-ticket');
    await expect(page).toHaveURL(/\/login/);

    await page.screenshot({
      path: getScreenshotPath('demo3-step2-logout-redirect.png'),
      fullPage: true,
    });
  });
});
