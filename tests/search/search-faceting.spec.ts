import { test } from '../fixtures';

import { FacetGroup, LayoutViewModeLocator, SearchFacetGroupHeaderNames } from '../models';

test('Facets appear', async ({ searchPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await searchPage.collectionSearchInput.queryFor('cats');
    await searchPage.collectionFacets.assertFacetGroupCount('search', SearchFacetGroupHeaderNames);
  });
});

test(`Facets for "movies" in Media Type facet group`, async ({
  searchPage,
}) => {
  await test.step(`Select "movies" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionSearchInput.queryFor('cats');
    await searchPage.collectionFacets.toggleFacetSelection(
      FacetGroup.MEDIATYPE,
      'movies',
      'positive',
    );
  });

  await test.step(`Check the first 10 results for "Movie" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icon-title',
      ['Movie'],
      true,
      10,
    );
  });
});

test(`Clear facet filters`, async ({ searchPage }) => {
  await test.step(`Select "data" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionSearchInput.queryFor('cats');
    await searchPage.collectionFacets.toggleFacetSelection(
      FacetGroup.MEDIATYPE,
      'data',
      'positive',
    );
  });

  await test.step(`Check the first 10 results for "Data" results`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icon-title',
      ['Data'],
      true,
      10,
    );
  });

  await test.step(`Click "Clear all filters"`, async () => {
    await searchPage.collectionFacets.clickClearAllFilters();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await searchPage.collectionFacets.assertClearAllFiltersNotVisible();
  });
});

test(`Select Year Published range via date picker`, async ({ searchPage }) => {
  await test.step(`Enter 2014 in start date text field (leftmost text box)`, async () => {
    await searchPage.collectionSearchInput.queryFor('cats');
    await searchPage.collectionFacets.fillUpYearFilters('2014', '2015');
  });

  await test.step('New results will be fetched', async () => {
    await searchPage.collectionFacets.displaysResultCount();
  });

  // it's easier to check dates in list view mode
  await test.step('Switch to list view mode', async () => {
    await searchPage.infiniteScroller.clickViewMode(LayoutViewModeLocator.LIST);
  });

  await test.step(`Check the first 10 results Published texts are ONLY 2014 or 2015`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'list-date',
      ['2014', '2015'],
      true,
      10,
    );
  });
});

test(`Negative facet to exclude "audio"`, async ({ searchPage }) => {
  await test.step(`Select "eye" icon near "audio" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionSearchInput.queryFor('cats');
    await searchPage.collectionFacets.toggleFacetSelection(
      FacetGroup.MEDIATYPE,
      'audio',
      'negative',
    );
  });

  await test.step(`Check the first 7 results for "Audio" results`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icon-title',
      ['Audio'],
      false,
      7,
    );
  });
});

test.skip(`Filter for title beginning with "X"`, async ({ searchPage }) => {
  test.info().annotations.push({
    type: 'Test',
    description: 'This test is still incomplete',
  });

  await test.step(`Select "Title" from the sort bar`, async () => {
    await searchPage.sortBar.applySortFilter('Title');
  });

  await test.step(`Select "X" from alphabet picker`, async () => {
    await searchPage.sortBar.clickAlphaBarLetterByPosition(23);
  });

  await test.step(`Results' titles ONLY begin with "X"`, async () => {
    // TODO
  });
});

test(`Facets can be selected via "Select filters" modal`, async ({
  searchPage,
}) => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await searchPage.collectionSearchInput.queryFor('cats');
    await searchPage.collectionFacets.clickMoreInFacetGroup(
      FacetGroup.MEDIATYPE
    );
  });

  await test.step(`Select "audio" and "texts" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetsInModal(['audio', 'texts']);
  });

  await test.step(`Check the first 10 results for "Audio" & "Texts" results`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icon-title',
      ['Audio', 'Text'],
      true,
      10,
    );
  });
});