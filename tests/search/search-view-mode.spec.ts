import { test, expect } from '@playwright/test';

test('page load', async ({ page }) => {
  await page.goto('https://archive.org/search?query=cats');

  await expect(page).toHaveURL(/query=cats/);

  const sortFilterBar = page.locator('sort-filter-bar');
  const sortContainer = sortFilterBar.locator('#container');
  const sortBarSection = sortFilterBar.locator('section#sort-bar');

  const sortDirectionSelector = sortBarSection.locator('.sort-direction-container');
  const sortByText = sortBarSection.locator('.sort-by-text');
  const sortSelectorContainer = sortBarSection.locator('div#sort-selector-container');
  const displayStyleSelector = sortBarSection.locator('div#display-style-selector');

  expect(await sortFilterBar.count()).toEqual(1);
  expect(await sortContainer.count()).toEqual(1);
  expect(await sortBarSection.count()).toEqual(1);

  expect(await sortDirectionSelector.count()).toEqual(1);
  expect(await sortByText.count()).toEqual(1);
  expect(await sortSelectorContainer.count()).toEqual(1);
  expect(await displayStyleSelector.count()).toEqual(1);
  
});
