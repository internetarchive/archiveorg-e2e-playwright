import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

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
 */
export default defineConfig({
  workers: 1,
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
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://archive.org',
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
