import { test } from '../fixtures';

test('Facets appear', async ({ searchPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await searchPage.collectionFacets.assertFacetGroupCount();
  });
});

test(`Facets for "movies" in Media Type facet group`, async ({ searchPage }) => {
  await test.step(`Select "movies" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.clickFacetInMediaType('movies');
  });

  await test.step(`Check first the 10 results for "Movie" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Movie'], true);
  });
});

test(`Clear facet filters`, async ({ searchPage }) => {
  await test.step(`Select "data" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.clickFacetInMediaType('movies');
  });

  await test.step(`Check first the 10 results for "Data" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Data'], true);
  });

  await test.step(`Click "Clear all filters"`, async () => {
    await searchPage.clickClearAllFilters();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await searchPage.assertClearAllFiltersNotVisible();
  });
});

test(`Select Year Published range via date picker`, async ({ searchPage }) => {
  // Enter 2014 in start date text field (leftmost text box)
  // Results are ONLY 2014 or 2015
});

test(`Negative facet to exclude "audio"`, async ({ searchPage }) => {
  await test.step(`Select "eye" icon near "audio" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectMediaTypeNegativeFacet('audio');
  });

  await test.step(`Check first the 10 results for "Audio" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Audio'], false);
  });
});

test(`Filter for title beginning with "X"`, async ({ searchPage }) => {
  await test.step(`Select "Title" from the sort bar`, async () => {
    await searchPage.sortBar.applySortFilter('Title');
  });

  await test.step(`Select "X" from alphabet picker`, async () => {
    await searchPage.sortBar.clickAlphaBarLetterByPosition(23);
  });

  // Results' titles ONLY begin with "X" 
});

test(`Facets can be selected via "Select filters" modal`, async ({ searchPage }) => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await searchPage.collectionFacets.clickMoreMediaTypeFacetGroup();
  });

  await test.step(`Select "image" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetsInModal(['audio', 'texts']);
  });

  await test.step(`Check first the 10 results for "Audio" & "Texts" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Audio', 'Text'], true);
  });
});
