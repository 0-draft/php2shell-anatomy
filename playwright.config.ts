import { defineConfig } from '@playwright/test';

const PREVIEW = 'http://localhost:4321/php2shell-anatomy/';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4321', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run serve:dist',
    url: PREVIEW,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
