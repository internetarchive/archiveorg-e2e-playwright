import { defineConfig, devices } from '@playwright/test';

import { config } from './config';

const formattedDateTime = () => {
  const d = new Date();
  const month = `${String(d.getMonth() + 1).padStart(2, '0')}`;
  const day = `${String(d.getDate() + 1).padStart(2, '0')}`;
  const hour = `${String(d.getHours()).padStart(2, '0')}`;
  const min = `${String(d.getMinutes()).padStart(2, '0')}`;

  const date = `${d.getFullYear()}-${month}-${day}`;
  const time = `${hour}.${min}.${d.getSeconds()}`;

  return `${date}T${time}`;
};

const reportName = () => `${process.env.CATEGORY}/${formattedDateTime()}`;
const summaryName = () => `${process.env.CATEGORY}-summary.json`;

/**
 * See https://playwright.dev/docs/test-configuration.
 * Read more about Playwright timeouts in: https://testerops.com/playwright-timeouts/
 *
 * Timeouts were set by `ms`
 */
export default defineConfig({
  // To use
  // trace: 'on-first-retry'
  // below to set retries: (to at least) 1
  retries: 1,

  // uncomment to run tests in parallel
  // fullyParallel: true,
  // AND uncomment line below
  // OR reverse to run tests sequentially
  workers: 1,

  // Set timeout for each test (currently 2 minutes)
  timeout: 2 * 60 * 1000,

  // Set maximum time the whole test suite can run (currently 40 minutes)
  globalTimeout: 40 * 60 * 1000,

  expect: {
    // Maximum time expect() should wait for the condition to be met
    // For example in `await expect(locator).toHaveText();`
    // (currently 2 minutes)
    timeout: 2 * 60 * 1000,
  },
  testDir: './tests',
  reporter: [
    ['./tests/reporters/progress-reporter.ts'],
    [
      'html',
      {
        outputFolder: `playwright-report/${reportName()}`,
        open: 'never',
      },
    ],
    [
      'json',
      {
        outputFile: `playwright-summary/${summaryName()}`,
        open: 'never',
      }
    ]
  ],
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // This is set in config/index.ts
    baseURL: config.baseURL,
    // Implied and comes into picture during the navigation from one page to another
    navigationTimeout: 1 * 60 * 1000,
    // If the test fails, it will retry once and create trace file if that fails
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop - Chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'Desktop - Firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'Desktop - Webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
