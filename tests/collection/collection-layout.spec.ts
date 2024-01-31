import { test } from '../fixtures';

import { LayoutViewModeLocator, SearchOption } from '../models';

test.beforeEach(async ({ collectionPage }) => {
  test.info().annotations.push({
    type: 'Test',
    description: 'Collection MDS search every each test',
  });

  await test.step(`Select "Search metadata"`, async () => {
    await collectionPage.searchPage.clickSearchInputOption(
      SearchOption.METADATA,
    );
  });

  await test.step(`Query for "radio"`, async () => {
    await collectionPage.searchPage.queryFor('radio');
  });

  await test.step(`Total result count is displayed`, async () => {
    await collectionPage.collectionFacets.checkResultCount();
  });
});

test('Tile, List, and Compact layout buttons change layout', async ({
  collectionPage,
}) => {
  await test.step('Click list view mode and check if it displays correctly', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.LIST,
    );
    await collectionPage.infiniteScroller.assertLayoutViewModeChange('list');
  });

  await test.step('Click compact view mode and check if it displays correctly', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.COMPACT,
    );
    await collectionPage.infiniteScroller.assertLayoutViewModeChange('compact');
  });

  await test.step('Click tile view mode and check if it displays correctly', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.TILE,
    );
    await collectionPage.infiniteScroller.assertLayoutViewModeChange('tile');
  });
});

test('Tile hover pane appears', async ({ collectionPage }) => {
  await test.step('Hover first item tile and check for title', async () => {
    await collectionPage.infiniteScroller.hoverToFirstItem();
  });

  await test.step('Check title text inside tile-hover-pane and item-tile', async () => {
    await collectionPage.infiniteScroller.assertTileHoverPaneTitleIsSameWithItemTile();
  });
});

test(`"Part Of" collection section appears`, async ({ collectionPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await collectionPage.collectionFacets.assertCollectionFacetGroupCount();
  });
});

test(`Clicking on an item tile takes you to the item`, async ({
  collectionPage,
}) => {
  await test.step('Click first item result and check if it directs to details page', async () => {
    await collectionPage.infiniteScroller.clickFirstResultAndCheckRedirectToDetailsPage();
  });
});

test(`Sort by All-time views in Tile view`, async ({ collectionPage }) => {
  await test.step('Switch to tile view mode', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.TILE,
    );
  });

  await test.step('Sort by All-time views - descending order', async () => {
    await collectionPage.sortBar.applySortFilter('All-time views');
    await collectionPage.sortBar.clickSortDirection('descending');
  });

  await test.step('Check the first 10 results if sort filters were applied', async () => {
    await collectionPage.infiniteScroller.checkSortingResults(
      'All-time views',
      'descending',
      10,
    );
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await collectionPage.searchPage.checkURLParamsWithSortFilter(
      'All-time views',
      'descending',
    );
  });
});

test(`Sort by Date published in List view`, async ({ collectionPage }) => {
  await test.step('Switch to list view mode', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.LIST,
    );
  });

  await test.step('Sort by Date published - descending order', async () => {
    await collectionPage.sortBar.applySortFilter('Date published');
    await collectionPage.sortBar.clickSortDirection('descending');
  });

  await test.step('Check the first 10 results if sort filters were applied', async () => {
    await collectionPage.infiniteScroller.checkSortingResults(
      'Date published',
      'descending',
      10,
    );
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await collectionPage.searchPage.checkURLParamsWithSortFilter(
      'Date published',
      'descending',
    );
  });
});

test(`Sort by Date archived (ascending) in Compact view`, async ({
  collectionPage,
}) => {
  await test.step('Switch to compact view mode', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.COMPACT,
    );
  });

  await test.step('Sort by Date archived - ascending order', async () => {
    await collectionPage.sortBar.applySortFilter('Date archived');
    await collectionPage.sortBar.clickSortDirection('ascending');
  });

  await test.step('Check list column headers for sort filter', async () => {
    await collectionPage.searchPage.checkCompactViewModeListLineDateHeaders(
      'Date archived',
    );
  });

  await test.step('Check if URL changed with correct sort filter and sort order param', async () => {
    await collectionPage.searchPage.checkURLParamsWithSortFilter(
      'Date archived',
      'ascending',
    );
  });
});
