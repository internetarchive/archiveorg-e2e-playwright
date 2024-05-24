import { test } from '../../tests/fixtures';

import {
  FacetGroupLocatorLabel,
  LayoutViewModeLocator,
} from '../../tests/models';

test(`Verify if facets appear on first load`, async ({ collectionPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await collectionPage.collectionFacets.assertCollectionFacetGroupCount();
  });
});

test.fixme(
  `Select a facet for videos and clear facet filters`,
  async ({ collectionPage }) => {
    await test.step(`Select "movies" from inside "Media Type" facet group and check 5 item results for "Movie" tile icon titles`, async () => {
      await collectionPage.collectionFacets.selectFacetByGroup(
        FacetGroupLocatorLabel.MEDIATYPE,
        'movies',
        'positive',
      );
      await collectionPage.infiniteScroller.validateIncludedFacetedResults(
        'tile-collection-icontitle',
        ['Movie'],
        true,
        5,
      );
    });

    await test.step(`Click "Clear all filters"`, async () => {
      await collectionPage.collectionBrowser.clickClearAllFilters();
      await collectionPage.collectionBrowser.assertClearAllFiltersNotVisible();
    });
  },
);

test(`Select Year Published range via date picker`, async ({
  collectionPage,
}) => {
  await test.step(`Enter 2014 in start date text field (leftmost text box) and new results will be loaded`, async () => {
    await collectionPage.collectionFacets.fillUpYearFilters('1954', '1955');
    await collectionPage.collectionFacets.displaysResultCount();
  });

  await test.step(`Switch to list view mode to check the first 10 item results Published texts are ONLY 2014 or 2015`, async () => {
    await collectionPage.infiniteScroller.clickViewMode(
      LayoutViewModeLocator.LIST,
    );
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'list-date',
      ['1954', '1955'],
      true,
      10,
    );
  });
});

test(`Negative facet to exclude audio`, async ({ collectionPage }) => {
  await test.step(`Select "eye" icon near "audio" from inside "Media Type" facet group and check if there's no results with "Audio" tile icon title`, async () => {
    await collectionPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      'audio',
      'negative',
    );
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-collection-icontitle',
      ['Audio'],
      false,
      20,
    );
  });
});

test.fixme(
  `Facets can be selected via Select filters modal`,
  async ({ collectionPage }) => {
    await test.step(`Click "More" button under Subject facet group`, async () => {
      await collectionPage.collectionFacets.clickMoreInFacetGroup(
        FacetGroupLocatorLabel.SUBJECT,
      );
    });

    await test.step(`Select "Comedy" and "Mystery" from inside "Subject" facet group`, async () => {
      await collectionPage.collectionFacets.selectFacetsInModal([
        'Comedy',
        'Mystery',
      ]);
      await collectionPage.infiniteScroller.validateIncludedFacetedResults(
        'tile-collection-icontitle',
        ['Audio'],
        true,
        20,
      );
    });
  },
);
