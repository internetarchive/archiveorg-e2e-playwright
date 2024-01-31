import { test } from '../fixtures';

import { LayoutViewModeLocator, SearchOption } from '../models';

test('Tile, List, and Compact layout buttons change layout', async ({
  collectionPage,
}) => {
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
  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });
});

test(`"Part Of" collection section appears`, async ({ collectionPage }) => {
  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });
});

test(`Clicking on an item tile takes you to the item`, async ({
  collectionPage,
}) => {
  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });
});

test(`Sort by All-time views in Tile view`, async ({ collectionPage }) => {
  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });
});

test(`Sort by Date published in List view`, async ({ collectionPage }) => {
  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });
});

test(`Sort by Date archived (ascending) in Compact view`, async ({
  collectionPage,
}) => {
  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });

  await test.step(``, async () => {
    // TODO:
  });
});
