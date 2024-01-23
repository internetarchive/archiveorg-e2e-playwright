import { test } from '../fixtures';

test('Tile, List, and Compact layout buttons change layout', async ({ searchPage }) => {
  await test.step('Click list view mode and check if it displays correctly', async () => {
    await searchPage.infiniteScroller.clickViewMode('list');
    await searchPage.infiniteScroller.assertLayoutViewModeChange('list');
  });

  await test.step('Click compact view mode and check if it displays correctly', async () => {
    await searchPage.infiniteScroller.clickViewMode('compact');
    await searchPage.infiniteScroller.assertLayoutViewModeChange('compact');
  });

  await test.step('Click tile view mode and check if it displays correctly', async () => {
    await searchPage.infiniteScroller.clickViewMode('tile');
    await searchPage.infiniteScroller.assertLayoutViewModeChange('tile');
  });
});

test('Tile hover pane appears', async ({ searchPage }) => {
  await test.step('Hover first item tile and check for title', async () => {
    await searchPage.infiniteScroller.hoverToFirstItem();
  });

  await test.step('Check title text inside tile-hover-pane and item-tile', async () => {
    await searchPage.infiniteScroller.assertTileHoverPaneTitleIsSameWithItemTile();
  });
});

test('Clicking on an item tile takes you to the item page', async ({ searchPage }) => {
  await searchPage.infiniteScroller.clickFirstResultAndCheckRedirectToDetailsPage();
});

test('Sort by All-time views in Tile view', async ({ searchPage }) => {
  await test.step('Switch to tile view mode', async () => {
    await searchPage.infiniteScroller.clickViewMode('tile');
  });

  await test.step('Sort by All-time views - descending order', async () => {
    await searchPage.sortBar.applySortFilter('All-time views');
    await searchPage.sortBar.clickSortDirection('descending');
  });

  await test.step('Check first the 10 results if sort filters were applied', async () => {
    await searchPage.infiniteScroller.checkItems('All-time views', 'descending');
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await searchPage.checkURLParamsWithSortFilter('All-time views', 'descending');
  });
});

test('Sort by Date published in List view', async ({ searchPage }) => {
  await test.step('Switch to list view mode', async () => {
    await searchPage.infiniteScroller.clickViewMode('list');
  });

  await test.step('Sort by Date published - descending order', async () => {
    await searchPage.sortBar.applySortFilter('Date published');
    await searchPage.sortBar.clickSortDirection('descending');
  });

  await test.step('Check first the 10 results if sort filters were applied', async () => {
    await searchPage.infiniteScroller.checkItems('Date published', 'descending');
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await searchPage.checkURLParamsWithSortFilter('Date published', 'descending');
  });
});

test('Sort by Date archived (ascending) in Compact view', async ({ searchPage }) => {
  await test.step('Switch to compact view mode', async () => {
    await searchPage.infiniteScroller.clickViewMode('compact');
  });

  await test.step('Sort by Date archived - ascending order', async () => {
    await searchPage.sortBar.applySortFilter('Date archived');
    await searchPage.sortBar.clickSortDirection('ascending');
  });

  await test.step('Check list column headers for sort filter', async () => {
    await searchPage.checkCompactViewModeListLineDateHeaders('Date archived');
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await searchPage.checkURLParamsWithSortFilter('Date archived', 'ascending');
  });
});
