import { Page, test } from '@playwright/test';

import { SearchPage } from './search-page';

let page: Page;
let searchPage: SearchPage;


const doSimpleMDSSearch = async (page: Page) => {
  // create new instance of SearchPage
  searchPage = new SearchPage(page);
  // Go to the starting url before each test.
  page.goto('https://archive.org/search?query=cats');
  await page.waitForTimeout(5000);
}

test.afterEach(async ({ page }) => {
  await page.close();
});

// test('Tile, List, and Compact layout buttons change layout', async ({ page }) => {
//   await doSimpleMDSSearch(page);
//   await searchPage.infiniteScroller.clickTileView();
//   await searchPage.infiniteScroller.clickListView();
//   await searchPage.infiniteScroller.clickListCompactView();
// });

// test('Tile hover pane appears', async ({ page }) => {
//   await doSimpleMDSSearch(page);
//   await searchPage.infiniteScroller.hoverToFirstItemAndCheckItemTitle();
// });

// test('Clicking on an item tile takes you to the item', async ({ page }) => {
//   await doSimpleMDSSearch(page);
//   await searchPage.infiniteScroller.clickFirstResultAndRedirectToDetailsPage();
// });

// test('Sort by All-time views in Tile view', async ({ page }) => {
//   await doSimpleMDSSearch(page);
//   await searchPage.infiniteScroller.clickTileView();
//   await searchPage.navigateSortBy('All-time views', 'descending');
//   await searchPage.checkInfiniteScrollerItems('All-time views', 'descending');
// });

test('Sort by Date published in List view', async ({ page }) => {
  await doSimpleMDSSearch(page);
  await searchPage.infiniteScroller.clickListView();
  await searchPage.navigateSortBy('Date published', 'descending');
  await searchPage.checkInfiniteScrollerItems('Date published', 'descending');
});

test('Sort by Date archived (descending) in Compact view', async ({ page }) => {
  await doSimpleMDSSearch(page);
  await searchPage.infiniteScroller.clickListCompactView();
  await searchPage.navigateSortBy('Date archived', 'descending');
  await searchPage.checkInfiniteScrollerItems('Date archived', 'descending');
});
