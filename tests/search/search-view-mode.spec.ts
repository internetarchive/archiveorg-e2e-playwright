import { test, expect } from '@playwright/test';

test('page load', async ({ page }) => {
  await page.goto('https://archive.org/search?query=cats');

  await expect(page).toHaveURL(/query=cats/);

  const infiniteScroller = page.locator('infinite-scroller');
  const sortFilterBar = page.locator('sort-filter-bar');
  const sortContainer = sortFilterBar.locator('#container');
  const sortBarSection = sortFilterBar.locator('section#sort-bar');

  expect(await infiniteScroller.count()).toEqual(1);
  expect(await sortFilterBar.count()).toEqual(1);
  expect(await sortContainer.count()).toEqual(1);
  expect(await sortBarSection.count()).toEqual(1);

  const sortDirectionContainer = sortBarSection.locator('.sort-direction-container');
  const sortByText = sortBarSection.locator('.sort-by-text');
  const sortDirectionSelector = sortDirectionContainer.locator('.sort-direction-selector');
  const srOnlySortDirection = sortDirectionContainer.locator('.sr-only');

  expect(await sortDirectionContainer.count()).toEqual(1);
  expect(await sortByText.count()).toEqual(1);
  expect(await sortDirectionSelector.count()).toEqual(1);
  expect(await srOnlySortDirection.count()).toEqual(1);

  expect(await sortByText.innerText()).toEqual('Sort by:');
  expect(await srOnlySortDirection.innerText()).toEqual('Change to ascending sort');

  const sortSelectorContainer = sortBarSection.locator('div#sort-selector-container');
  const mobileSort = sortSelectorContainer.locator('#mobile-sort-container');
  const desktopSort = sortSelectorContainer.locator('#desktop-sort-container');
  
  const desktopSortSelector = desktopSort.locator('#desktop-sort-selector');
  const desktopSortSelectorTexts = await desktopSort.locator('ul#desktop-sort-selector').allInnerTexts();
  const desktopSortTexts = Object.assign([], desktopSortSelectorTexts[0].split('\n'));

  const sortTextList = [
    'Relevance',
    'Weekly views', 
    'Title', 
    'Date published', 
    'Creator'
  ];

  await desktopSortSelector.click();
  await expect(page).toHaveURL(/sort=title/);

  await page.waitForTimeout(5000);
  expect(await srOnlySortDirection.innerText()).toEqual('Change to descending sort');

  desktopSortTexts.forEach((text: string, ix) => {
    expect(text.includes(sortTextList[ix]));
  });
  
  expect(await sortSelectorContainer.count()).toEqual(1);
  expect(await desktopSortSelector.count()).toEqual(1);

  // sort-bar
  expect(await expect(mobileSort).toHaveClass(/hidden/));
  expect(await expect(desktopSort).toHaveClass(/visible/));

  // view modes
  const displayStyleSelector = sortBarSection.locator('div#display-style-selector');
  const displayStyleSelectorOptions = displayStyleSelector.locator('ul > li');

  expect(await displayStyleSelector.count()).toEqual(1);
  expect(await displayStyleSelectorOptions.count()).toEqual(3);
  expect(await displayStyleSelectorOptions.nth(0).locator('#grid-button').count()).toEqual(1);
  expect(await displayStyleSelectorOptions.nth(1).locator('#list-detail-button').count()).toEqual(1);
  expect(await displayStyleSelectorOptions.nth(2).locator('#list-compact-button').count()).toEqual(1);

  // view mode - default grid view
  expect(await expect(infiniteScroller).toHaveClass(/grid/));

  // view mode - click list-detail
  await displayStyleSelectorOptions.nth(1).click();
  expect(await expect(infiniteScroller).toHaveClass(/list-detail/));

  // view mode - click list-compact
  await displayStyleSelectorOptions.nth(2).click();
  expect(await expect(infiniteScroller).toHaveClass(/list-compact/));

});
