import { test } from '../fixtures';

import { LayoutViewModeLocator, SearchOption } from '../models';

test('Tile, List, and Compact layout buttons change layout', async ({
  collectionPage,
}) => {
  await test.step('Display List View', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.LIST,
    );
    await collectionPage.infiniteScroller.assertLayoutViewModeChange('list');
  });

  await test.step('Display List Compact View', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.COMPACT,
    );
    await collectionPage.infiniteScroller.assertLayoutViewModeChange('compact');
  });

  await test.step('Display Tile View', async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.TILE,
    );
    await collectionPage.infiniteScroller.assertLayoutViewModeChange('tile');
  });
});

test.fixme('Tile hover pane appears', async ({ collectionPage }) => {
  await test.step('Hover first item tile and check for title text inside tile-hover-pane and item-tile', async () => {
    await collectionPage.infiniteScroller.hoverToFirstItem();
    await collectionPage.infiniteScroller.assertTileHoverPaneTitleIsSameWithItemTile();
  });
});

test.fixme(
  `Clicking on an item tile takes you to the item`,
  async ({ collectionPage }) => {
    await test.step('Click first item result and check if it directs to details page', async () => {
      await collectionPage.infiniteScroller.clickFirstResultAndCheckRedirectToDetailsPage();
    });
  },
);

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
    await collectionPage.infiniteScroller.validateSortingResults(
      'All-time views',
      'descending',
      10,
    );
    await collectionPage.collectionBrowser.validateURLParamsWithSortFilter(
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
    await collectionPage.infiniteScroller.validateSortingResults(
      'Date published',
      'descending',
      10,
    );
    await collectionPage.collectionBrowser.validateURLParamsWithSortFilter(
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
    await collectionPage.collectionBrowser.validateCompactViewModeListLineDateHeaders(
      'Date archived',
    );
    await collectionPage.collectionBrowser.validateURLParamsWithSortFilter(
      'Date archived',
      'ascending',
    );
  });
});

test.beforeEach(async ({ collectionPage }) => {
  test.info().annotations.push({
    type: 'Test',
    description: 'Do collection metadata search every each test',
  });

  await test.step(`Select "Search metadata" and do a metadata search for "radio"`, async () => {
    await collectionPage.collectionBrowser.clickSearchInputOption(
      SearchOption.METADATA,
    );
    await collectionPage.collectionBrowser.queryFor('radio');
  });
});
