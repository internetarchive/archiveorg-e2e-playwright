import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://archive.org/search');

  // Expects the URL to contain search.
  await expect(page).toHaveURL(/search/);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Internet Archive: Digital Library of Free & Borrowable Books, Movies, Music & Wayback Machine/);
});

