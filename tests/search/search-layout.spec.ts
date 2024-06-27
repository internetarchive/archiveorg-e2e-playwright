import { test } from '../fixtures';

import { LayoutViewModeLocator } from '../models';

test('Tile, List, and Compact layout buttons change layout', async ({
  searchPage,
}) => {
  await test.step('Display List View', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.LIST);
    await searchPage.infiniteScroller.assertLayoutViewModeChange('list');
  });

  await test.step('Display List Compact View', async () => {
    await searchPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.COMPACT,
    );
    await searchPage.infiniteScroller.assertLayoutViewModeChange('compact');
  });

  await test.step('Display Tile View', async () => {
    await searchPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.TILE);
    await searchPage.infiniteScroller.assertLayoutViewModeChange('tile');
  });
});

test.fixme('Tile hover pane appears', async ({ searchPage }) => {
  await test.step('Hover first item tile and check for title text inside tile-hover-pane and item-tile', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.infiniteScroller.hoverToFirstItem();
    await searchPage.infiniteScroller.assertTileHoverPaneTitleIsSameWithItemTile();
  });
});

test('Clicking on an item tile takes you to the item page', async ({
  searchPage,
}) => {
  await test.step('Click first item result and check if it directs to details page', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.infiniteScroller.clickFirstResultAndCheckRedirectToDetailsPage();
  });
});

test('Sort by All-time views in Tile view', async ({ searchPage }) => {
  await test.step('Switch to tile view mode', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.TILE);
  });

  await test.step('Sort by All-time views - descending order', async () => {
    await searchPage.sortBar.applySortFilter('All-time views');
    await searchPage.sortBar.clickSortDirection('descending');
  });

  await test.step('Check the first 10 results if sort filters were applied', async () => {
    await searchPage.infiniteScroller.validateSortingResults(
      'All-time views',
      'descending',
      10,
    );
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await searchPage.collectionBrowser.validateURLParamsWithSortFilter(
      'All-time views',
      'descending',
    );
  });
});

test('Sort by Date published in List view', async ({ searchPage }) => {
  await test.step('Switch to list view mode', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.LIST);
  });

  await test.step('Sort by Date published - descending order', async () => {
    await searchPage.sortBar.applySortFilter('Date published');
    await searchPage.sortBar.clickSortDirection('descending');
  });

  await test.step('Check the first 10 results if sort filters were applied', async () => {
    await searchPage.infiniteScroller.validateSortingResults(
      'Date published',
      'descending',
      10,
    );
    await searchPage.collectionBrowser.validateURLParamsWithSortFilter(
      'Date published',
      'descending',
    );
  });
});

test('Sort by Date archived (ascending) in Compact view', async ({
  searchPage,
}) => {
  await test.step('Switch to compact view mode', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.COMPACT,
    );
  });

  await test.step('Sort by Date archived - ascending order', async () => {
    await searchPage.sortBar.applySortFilter('Date archived');
    await searchPage.sortBar.clickSortDirection('ascending');
  });

  await test.step('Check list column headers for sort filter', async () => {
    await searchPage.collectionBrowser.validateCompactViewModeListLineDateHeaders(
      'Date archived',
    );
    await searchPage.collectionBrowser.validateURLParamsWithSortFilter(
      'Date archived',
      'ascending',
    );
  });
});