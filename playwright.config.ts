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
 * 
 * Timeouts were set by `ms`
 */
export default defineConfig({
  workers: 1,
  // Set timeout for each test (currently 2 minutes)
  timeout: 2 * 60 * 1000, 
  // Set maximum time the whole test suite can run (currently 30 minutes)
  globalTimeout: 30 * 60 * 1000,
  testDir: './tests',
  reporter: [
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
