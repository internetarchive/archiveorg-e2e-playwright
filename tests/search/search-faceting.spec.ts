import { test } from '../fixtures';

test('Facets appear', async ({ searchPage }) => {
  await test.step('Check facet group headers count', async () => {
    await searchPage.collectionFacets.checkFacetGroups();
  });
});

test(`Facet for "image"`, async ({ searchPage }) => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await searchPage.collectionFacets.clickMoreMediaTypeFacet();
  });

  await test.step(`Select "image" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetTitleInMoreFacetsModal('image');
  });

  await test.step(`Check first the 10 results for "Image" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkFacetingResults('Image');
  });
});

test(`Clear facet filters`, async ({ searchPage }) => {
  await test.step(`Click "More" button under Media type facet group`, async () => {
    await searchPage.collectionFacets.clickMoreMediaTypeFacet();
  });

  await test.step(`Select "texts" from inside "Media Type" facet group`, async () => {
    await searchPage.collectionFacets.selectFacetTitleInMoreFacetsModal('texts');
  });

  await test.step(`Check first the 10 results for "Text" results`, async () => {
    // checking the tileIcon title for now which is set in a `Title case` format
    await searchPage.infiniteScroller.checkFacetingResults('Text');
  });

  await test.step(`Click "Clear all filters"`, async () => {
    await searchPage.clickClearAllFilters();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await searchPage.assertClearAllFiltersNotVisible();
  });
});

