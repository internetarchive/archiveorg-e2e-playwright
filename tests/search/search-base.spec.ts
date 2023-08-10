import { expect } from '@playwright/test';
import { test } from '../../fixtures';

test('page load - initial load', async ({ page }) => {
  await page.goto('https://archive.org/search');
  await page.waitForTimeout(3000);

  await expect(page).toHaveURL(/search/);

  expect(await page.locator('#search-bar-container').count()).toEqual(1);
  expect(await page.locator('#search_options').count()).toEqual(1);
  expect(await page.locator('#action-bar-spacing').count()).toEqual(1);
  expect(await page.locator('#go-button').count()).toEqual(1);

  expect(await page.locator('empty-placeholder').count()).toEqual(1);
  expect(await page.getByRole('heading', { 
    name: 'To begin searching, enter a search term in the box above and hit "Go".' 
  }).count()).toEqual(1);
  expect(await page.locator('#content-container svg').count()).toEqual(1);

  const searchInput = page.getByRole('textbox', { 
    name: 'Search the Archive. Filters and Advanced Search available below.' 
  });

  await searchInput.fill('cats');
  await searchInput.press('Enter');

  await page.waitForURL("https://archive.org/search?query=cats");
});

