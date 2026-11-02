import { defineConfig, devices } from '@playwright/test';

const testDatabaseUrl =
  process.env.DATABASE_URL_TEST ||
  'postgresql://popqueue:popqueue_dev_password@localhost:5435/popqueue_test?connection_limit=20';

export default defineConfig({
  testDir: './',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.CLIENT_URL || 'http://localhost:3000',
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev --workspace=server',
      url: 'http://localhost:4000/api/v1/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      env: {
        NODE_ENV: 'test',
        PORT: '4000',
        DATABASE_URL: testDatabaseUrl,
        CORS_ORIGIN: 'http://localhost:3000',
      },
    },
    {
      command: 'npm run dev --workspace=client',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      env: {
        VITE_API_URL: 'http://localhost:4000',
      },
    },
  ],
});
