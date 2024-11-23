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

/**
 * See https://playwright.dev/docs/test-configuration.
 * 
 * Timeouts are set by `ms`.
 * Can be modified if needed
 */
export default defineConfig({
  workers: 5,
  // Timeout for each test
  timeout: 2 * 60 * 1000,         // 2 mins
  // Maximum time the whole test suite can run
  globalTimeout: 20 * 60 * 1000,  // 20 mins
  testDir: './tests',
  reporter: [
    [
      'html',
      {
        outputFolder: `playwright-report/${reportName()}`,
        open: 'never',
      },
    ],
  ],
  expect: {
    timeout: 2 * 60 * 1000,  // set to 2min
  },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // This is set in config/index.ts
    baseURL: config.baseURL,
    actionTimeout: 2 * 60 * 1000,  // set to 2min
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop - Chromium',
      use: {
        ...devices['Desktop Chrome'],
        ignoreHTTPSErrors: true,  // this is needed to avoid getting warnings like: the website is not safe
      },
    },
    {
      name: 'Desktop - Firefox',
      use: {
        ...devices['Desktop Firefox'],
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'Desktop - Webkit',
      use: {
        ...devices['Desktop Safari'],
        ignoreHTTPSErrors: true,
      },
    },
  ],
});
