import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...
await page.goto('https://archive.org/details/oldtimeradio');
await page.locator('#page-container li').filter({ hasText: 'Collection' }).click();
await page.locator('#page-container li').filter({ hasText: 'About' }).click();
await page.locator('li').filter({ hasText: 'Forum (3,208)' }).click();});