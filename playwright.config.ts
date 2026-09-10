import { defineConfig, devices } from '@playwright/test';

const executable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: isCI ? 1 : undefined,
  retries: isCI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: isCI
    ? [
        ['github'],
        ['list'],
        ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }],
      ],
  outputDir: 'artifacts/playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: executable ? { executablePath: executable } : undefined,
  },
  webServer: {
    command: 'npm run db:reset-local && npm run dev -- --hostname 0.0.0.0',
    url: 'http://127.0.0.1:3000/api/health',
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'tablet',
      use: {
        browserName: 'chromium',
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'mobile-reduced-motion',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        reducedMotion: 'reduce',
      },
    },
  ],
});
