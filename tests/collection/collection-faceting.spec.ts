import { test } from '../fixtures';

import { FacetGroupLocatorLabel, LayoutViewModeLocator, SearchOption } from '../models';

import { CollectionPage } from '../pageObjects/collection-page';

let collectionPage: CollectionPage;

test.afterAll(async () => {
  await collectionPage.page.close();
});


test.describe('Collection Page - Basic display tests', () => {
  test.describe.configure({ mode: 'serial' });

  test(`Search and go to "oldtimeradio" collection page`, async ({ browser }) => {
    const browserPage = await browser.newPage();
    collectionPage = new CollectionPage(browserPage);

    await test.step(`Go to "oldtimeradio" collection page`, async () => {
      await collectionPage.visit('oldtimeradio');
    });
  });

  test('Verify if facets appear on first load', async () => {
    await test.step('Assert facet group headers count', async () => {
      await collectionPage.collectionFacets.assertCollectionFacetGroupCount();
    });
  });

  test(`Select a facet for "videos"`, async () => {
    await test.step(`Select "movies" from inside "Media Type" facet group and check 5 item results for "Movie" tile icon titles`, async () => {
      await collectionPage.collectionFacets.selectFacetByGroup(
        FacetGroupLocatorLabel.MEDIATYPE,
        'movies',
        'positive'
      );
      await collectionPage.infiniteScroller.validateIncludedFacetedResults(
        'tile-icontitle',
        ['Movie'],
        true,
        5
      );
    });
  });

  test('Clear facet filters', async () => {
    await test.step(`Click "Clear all filters"`, async () => {
      await collectionPage.searchPage.clickClearAllFilters();
      await collectionPage.searchPage.assertClearAllFiltersNotVisible();
    });
  });

  test(`Select Year Published range via date picker`, async () => {
    await test.step(`Enter 2014 in start date text field (leftmost text box) and new results will be loaded`, async () => {
      await collectionPage.collectionFacets.fillUpYearFilters('1954', '1955');
      await collectionPage.collectionFacets.displaysResultCount();
    });


    await test.step(`Switch to list view mode to check the first 10 item results Published texts are ONLY 2014 or 2015`, async () => {
      await collectionPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.LIST);
      await collectionPage.infiniteScroller.validateIncludedFacetedResults(
        'list-date',
        ['1954', '1955'],
        true,
        10
      );
    });
  });

  test('Clear facet filters and switch to Tile view mode', async () => {
    await test.step(`Click "Clear all filters" and switch to Tile view mode`, async () => {
      await collectionPage.page.waitForFunction('load');
      await collectionPage.searchPage.clickClearAllFilters();
      await collectionPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.LIST);
    });
  });

  test(`Negative facet to exclude "audio"`, async () => {
    await test.step(`Select "eye" icon near "audio" from inside "Media Type" facet group and check if there's no results with "Audio" tile icon title`, async () => {
      await collectionPage.collectionFacets.selectFacetByGroup(
        FacetGroupLocatorLabel.MEDIATYPE,
        'audio',
        'negative'
      );
      await collectionPage.infiniteScroller.validateIncludedFacetedResults(
        'tile-icontitle',
        ['Audio'],
        false,
        7
      );
    });
  });

  test.skip(`Filter for title beginning with "X"`, async () => {
    // TODO
  });

  test(`Facets can be selected via "Select filters" modal`, async () => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await collectionPage.collectionFacets.clickMoreInFacetGroup(
      FacetGroupLocatorLabel.MEDIATYPE
    );
  });

  await test.step(`Select "audio" and "texts" from inside "Media Type" facet group`, async () => {
    await collectionPage.collectionFacets.selectFacetsInModal(['audio', 'texts']);
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Audio', 'Text'],
      true,
      10
    );
  });
});

});
