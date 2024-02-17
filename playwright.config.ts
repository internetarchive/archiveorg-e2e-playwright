import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

const formattedDateTime = () => {
  const d = new Date();
  const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const time = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;

  return `${date}T${time}`;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  workers: 1,
  testDir: './tests',
  reporter: [
    [
      'html', { 
        outputFolder: `playwright-report/${process.env.CATEGORY}/${(formattedDateTime())}`, 
        open: 'never'
      }
    ] 
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
