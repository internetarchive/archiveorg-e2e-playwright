import { test as base } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const caps = {
  'build': 'playwright-e2e-' + Math.floor(Math.random() * 300),
  'browserstack.username': process.env.BROWSERSTACK_USERNAME,
  'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  'browser': 'playwright-firefox',  // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
  'os': 'osx',
  'os_version': 'Big Sur',
};

export const test = base.extend({
  page: async ({ playwright }, use, testInfo) => {
    const vBrowser = await playwright.chromium.connect({ wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`,});
    const vContext = await vBrowser.newContext(testInfo.project.use);
    const vPage = await vContext.newPage();
    await use(vPage);
    await vPage.close();
    await vBrowser.close();
  }
});