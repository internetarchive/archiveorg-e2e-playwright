import { test, expect } from '@playwright/test';

import { identifier, testBeforeEachConfig } from '../../config';

test.beforeEach(async ({ context }) => {
  await testBeforeEachConfig(context);
});

test('Bookserver page has correct title and text', async ({ page }) => {
  await page.goto(identifier.static.bookserver);
  await expect(page).toHaveTitle(/Internet Archive: A Future for Books -- BookServer/);
  await expect(page.locator('h1:has-text("A Future for Books -- BookServer")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('The widespread success of digital reading');
});

test('Scanning page has correct title and text', async ({ page }) => {
    await page.goto(identifier.static.scanning);
    await expect(page).toHaveTitle(/Internet Archive: Digitization Services/);
    await expect(page.locator('h1:has-text("Scanning Services")')).toBeVisible();
    await expect(page.locator('#maincontent')).toContainText('Open and free online discovery');
  });

test('Web > Petabox page has correct title and text', async ({ page }) => {
  await page.goto(identifier.static.petabox);
  await expect(page).toHaveTitle(/Internet Archive: Petabox/);
  await expect(page.locator('h1:has-text("Petabox")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('A few highlights from the Petabox');
});

test('Web > SFlan page has correct title and text', async ({ page }) => {
  await page.goto(identifier.static.sflan);
  await expect(page).toHaveTitle(/Internet Archive: SFLan/);
  await expect(page.locator('h1:has-text("Community Wireless")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('Internet access in bulk, delivered');
});
