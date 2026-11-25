import { test, expect } from '@playwright/test';
import {
  resetTestDatabase,
  testPrisma,
  COLLECTOR_PASSWORD,
  STAFF_PASSWORD,
} from './helpers/test-db.js';

const API_BASE = process.env.API_URL || 'http://localhost:4000';

test.describe('TEST-44C / AC-44.8: Public Queue Display Board (/board) Polling & Degraded State', () => {
  test.beforeEach(async () => {
    await resetTestDatabase();
    await testPrisma.series.updateMany({ where: { code: { in: ['CRY', 'LAB'] } }, data: { isActive: true } });
    await testPrisma.series.updateMany({ where: { code: 'SKP' }, data: { isActive: false } });
  });

  test.afterAll(async () => {
    await resetTestDatabase();
    await testPrisma.series.updateMany({ where: { code: { in: ['CRY', 'LAB'] } }, data: { isActive: true } });
    await testPrisma.series.updateMany({ where: { code: 'SKP' }, data: { isActive: false } });
  });

  test('updates automatically via 3s polling without reload and displays degraded banner on API error', async ({
    page,
    request,
  }) => {
    const crySeries = await testPrisma.series.findUniqueOrThrow({ where: { code: 'CRY' } });

    // 1. Open /board unauthenticated
    await page.goto('/board');
    await expect(page.locator('[data-testid="public-board-page"]')).toBeVisible();
    await expect(page.locator('[data-series="CRY"]')).toBeVisible();
    await expect(page.locator('[data-series="LAB"]')).toBeVisible();
    // DEC-04: SKP is closed and has 0 active tickets -> hidden
    await expect(page.locator('[data-series="SKP"]')).toHaveCount(0);
    await expect(page.locator('[data-series="CRY"]')).toContainText('ไม่มีคิวรอในขณะนี้');

    // 2. Collector joins CRY via API while /board stays open
    const collectorLoginRes = await request.post(`${API_BASE}/api/auth/login`, {
      data: { username: 'collector1', password: COLLECTOR_PASSWORD },
    });
    expect(collectorLoginRes.status()).toBe(200);
    const collectorToken = (await collectorLoginRes.json()).data.token as string;

    const joinRes = await request.post(`${API_BASE}/api/tickets/join`, {
      headers: { Authorization: `Bearer ${collectorToken}` },
      data: { seriesId: crySeries.id },
    });
    expect(joinRes.status()).toBe(201);

    // Wait <= 5s for 3s polling to show CRY-001 in Up Next without reloading
    await expect(page.locator('[data-series="CRY"] .board-upnext-list')).toContainText('CRY-001', {
      timeout: 5000,
    });

    // 3. Staff calls next ticket via API
    const staffLoginRes = await request.post(`${API_BASE}/api/auth/login`, {
      data: { username: 'staff_crybaby', password: STAFF_PASSWORD },
    });
    expect(staffLoginRes.status()).toBe(200);
    const staffToken = (await staffLoginRes.json()).data.token as string;

    const callNextRes = await request.post(`${API_BASE}/api/staff/call-next`, {
      headers: { Authorization: `Bearer ${staffToken}` },
      data: { seriesId: crySeries.id },
    });
    expect(callNextRes.status()).toBe(200);

    // Wait <= 5s for 3s polling to move CRY-001 into Now Serving with CALLED badge
    await expect(page.locator('[data-series="CRY"] .board-now-serving')).toContainText('CRY-001', {
      timeout: 5000,
    });
    await expect(page.locator('[data-series="CRY"] .board-now-serving')).toContainText('CALLED', {
      timeout: 5000,
    });

    // 4. Simulate API outage and verify degraded banner appears within 5s
    await page.route('**/api/public/queue-board', (route) => route.abort());
    await expect(page.locator('[data-testid="board-degraded-banner"]')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('[data-testid="board-degraded-banner"]')).toContainText(
      'กำลังเชื่อมต่อเซิร์ฟเวอร์ใหม่...',
    );

    // 5. Restore API and verify degraded banner clears automatically
    await page.unroute('**/api/public/queue-board');
    await expect(page.locator('[data-testid="board-degraded-banner"]')).toBeHidden({
      timeout: 5000,
    });
  });
});
