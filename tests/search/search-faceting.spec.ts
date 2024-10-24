import { test } from '../fixtures';

import { FacetGroupFilterHeaderEnum, FacetGroupLocatorLabel, LayoutViewModeLocator } from '../models';

test('Facets appear', async ({ searchPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.collectionFacets.assertSearchFacetGroupCount();
  });
});

test(`Facets for "movies" in Media Type facet group`, async ({
  searchPage,
}) => {
  await test.step(`Select "movies" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      FacetGroupFilterHeaderEnum.MEDIATYPE,
      'movies',
      'positive',
    );
  });

  await test.step(`Check the first 10 results for "Movie" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Movie'],
      true,
      10,
    );
  });
});

test(`Clear facet filters`, async ({ searchPage }) => {
  await test.step(`Select "data" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      FacetGroupFilterHeaderEnum.MEDIATYPE,
      'data',
      'positive',
    );
  });

  await test.step(`Check the first 10 results for "Data" results`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Data'],
      true,
      10,
    );
  });

  await test.step(`Click "Clear all filters"`, async () => {
    await searchPage.collectionBrowser.clickClearAllFilters();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await searchPage.collectionBrowser.assertClearAllFiltersNotVisible();
  });
});

test(`Select Year Published range via date picker`, async ({ searchPage }) => {
  await test.step(`Enter 2014 in start date text field (leftmost text box)`, async () => {
    await searchPage.collectionBrowser.queryFor('cats');
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
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.collectionFacets.selectFacetByGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      FacetGroupFilterHeaderEnum.MEDIATYPE,
      'audio',
      'negative',
    );
  });

  await test.step(`Check the first 7 results for "Audio" results`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
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
    await searchPage.collectionBrowser.queryFor('cats');
    await searchPage.collectionFacets.clickMoreInFacetGroup(
      FacetGroupLocatorLabel.MEDIATYPE,
      FacetGroupFilterHeaderEnum.MEDIATYPE,
    );
  });

  await test.step(`Select "audio" and "texts" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetsInModal(['audio', 'texts']);
  });

  await test.step(`Check the first 10 results for "Audio" & "Texts" results`, async () => {
    await searchPage.infiniteScroller.validateIncludedFacetedResults(
      'tile-icontitle',
      ['Audio', 'Text'],
      true,
      10,
    );
  });
});