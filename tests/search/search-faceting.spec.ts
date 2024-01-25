import { test } from '../fixtures';
import { FacetGroupLabel } from '../models';

test('Facets appear', async ({ searchPage }) => {
  await test.step('Assert facet group headers count', async () => {
    await searchPage.collectionFacets.assertFacetGroupCount();
  });
});

test(`Facets for "movies" in Media Type facet group`, async ({ searchPage }) => {
  await test.step(`Select "movies" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetByGroup(FacetGroupLabel.MEDIATYPE, 'movies', 'positive');
  });

  await test.step(`Check the first 10 results for "Movie" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Movie', 'Data'], true, 10);
  });
});

test(`Clear facet filters`, async ({ searchPage }) => {
  await test.step(`Select "data" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetByGroup(FacetGroupLabel.MEDIATYPE,'data', 'positive');
  });

  await test.step(`Check the first 10 results for "Data" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Data'], true, 10);
  });

  await test.step(`Click "Clear all filters"`, async () => {
    await searchPage.clickClearAllFilters();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await searchPage.assertClearAllFiltersNotVisible();
  });
});

test(`Select Year Published range via date picker`, async ({ searchPage }) => {
  test.info().annotations.push(({
    type: 'Test',
    description: 'This test will fail still not working'
  }))

  await test.step(`Enter 2014 in start date text field (leftmost text box)`, async () => {
    await searchPage.collectionFacets.fillUpYearFilters('2014', '2015');
  });

  await test.step(`Results are ONLY 2014 or 2015`, async () => {
    // TODO
  });
});

test(`Negative facet to exclude "audio"`, async ({ searchPage }) => {
  await test.step(`Select "eye" icon near "audio" from inside "Media Type" facet group`, async () => {
    // await searchPage.collectionFacets.selectNegativeFacetByGroup(FacetGroupLabel.MEDIATYPE, 'audio');
    await searchPage.collectionFacets.selectFacetByGroup(FacetGroupLabel.MEDIATYPE, 'audio', 'negative');
  });

  await test.step(`Check the first 7 results for "Audio" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Audio'], false, 7);
  });
});

test(`Filter for title beginning with "X"`, async ({ searchPage }) => {
  test.info().annotations.push(({
    type: 'Test',
    description: 'This test will fail still not working'
  }))
  
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

test(`Facets can be selected via "Select filters" modal`, async ({ searchPage }) => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await searchPage.collectionFacets.clickMoreInFacetGroup(FacetGroupLabel.MEDIATYPE);
  });

  await test.step(`Select "audio" and "texts" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetsInModal(['audio', 'texts']);
  });

  await test.step(`Check the first 10 results for "Audio" & "Texts" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkIncludedFacetingResults(['Audio', 'Text'], true, 10);
  });
});
