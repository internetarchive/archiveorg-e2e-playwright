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

test('Clicking on an item tile takes you to the item', async ({ searchPage }) => {
  await searchPage.infiniteScroller.clickFirstResultAndCheckRedirectToDetailsPage();
});

// test('Sort by All-time views in Tile view', async ({ searchPage }) => {
//   await searchPage.infiniteScroller.clickViewMode('tile');
//   await searchPage.navigateSortBy('All-time views', 'descending');
//   await searchPage.checkInfiniteScrollerItems('All-time views', 'descending');
// });

// test('Sort by Date published in List view', async ({ searchPage }) => {
//   await searchPage.infiniteScroller.clickListView();
//   await searchPage.navigateSortBy('Date published', 'descending');
//   await searchPage.checkInfiniteScrollerItems('Date published', 'descending');
// });

// test('Sort by Date archived (ascending) in Compact view', async ({ searchPage }) => {
//   await searchPage.infiniteScroller.clickListCompactView();
//   await searchPage.navigateSortBy('Date archived', 'ascending');
//   await searchPage.checkInfiniteScrollerItems('Date archived', 'ascending');
// });
