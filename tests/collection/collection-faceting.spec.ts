import { test } from '../fixtures';

import { FacetGroupLocatorLabel, LayoutViewModeLocator, SearchOption } from '../models';

test.beforeEach(async ({ collectionPage }) => {
  test.info().annotations.push({
    type: 'Test',
    description: 'Do collection metadata search every each test'
  });

  await test.step(`Select "Search metadata" and do a metadata search for "radio"`, async () => {
    await collectionPage.searchPage.clickSearchInputOption(SearchOption.METADATA);
    await collectionPage.searchPage.queryFor('radio');
  });
});

test.skip('Facets appear', async ({ collectionPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await collectionPage.collectionFacets.assertCollectionFacetGroupCount();
  });
});

test.skip(`Facet for "movies"`, async ({ collectionPage }) => {
  await test.step(`Select "movies" from inside "Media Type" facet group`, async () => {
    await collectionPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      'movies',
      'positive'
    );
  });

  await test.step(`Check the first 10 results for "Movie" results`, async () => {
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Movie'],
      true,
      10
    );
  });
});

test.skip('Clear facet filters', async ({ collectionPage }) => {
  await test.step(`Select "data" from inside "Media Type" facet group`, async () => {
    await collectionPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      'data',
      'positive'
    );
  });

  await test.step(`Check the first 10 results for "Data" results`, async () => {
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Data'],
      true,
      10
    );
  });

  await test.step(`Click "Clear all filters"`, async () => {
    await collectionPage.searchPage.clickClearAllFilters();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await collectionPage.searchPage.assertClearAllFiltersNotVisible();
  });
});

test.skip(`Select Year Published range via date picker`, async ({ collectionPage }) => {
  await test.step(`Enter 2014 in start date text field (leftmost text box)`, async () => {
    await collectionPage.collectionFacets.fillUpYearFilters('1954', '1955');
  });

  await test.step('New results will be fetched', async () => {
    await collectionPage.collectionFacets.displaysResultCount();
  });

  // it's easier to check dates in list view mode
  await test.step('Switch to list view mode', async () => {
    await collectionPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.LIST);
  });

  await test.step(`Check the first 10 results Published texts are ONLY 2014 or 2015`, async () => {
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'list-date',
      ['1954', '1955'],
      true,
      10
    );
  });
});

test.skip(`Negative facet to exclude "audio"`, async ({ collectionPage }) => {
  await test.step(`Select "eye" icon near "audio" from inside "Media Type" facet group`, async () => {
    await collectionPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      'audio',
      'negative'
    );
  });

  await test.step(`Check the first 7 results for "Audio" results`, async () => {
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Audio'],
      false,
      7
    );
  });
});

test.skip(`Filter for title beginning with "X"`, async ({ collectionPage }) => {
  await test.step('', async () => {
    // TODO
  });
});

test.skip(`Facets can be selected via "Select filters" modal`, async ({
  collectionPage
}) => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await collectionPage.collectionFacets.clickMoreInFacetGroup(
      FacetGroupLocatorLabel.MEDIATYPE
    );
  });

  await test.step(`Select "audio" and "texts" from inside "Media Type" facet group`, async () => {
    await collectionPage.collectionFacets.selectFacetsInModal(['audio', 'texts']);
  });

  await test.step(`Check the first 10 results for "Audio" & "Texts" results`, async () => {
    await collectionPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Audio', 'Text'],
      true,
      10
    );
  });
});
