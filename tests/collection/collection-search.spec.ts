import { test } from '../fixtures';
import { SearchOption } from '../models';

test('Collection search metadata', async ({ collectionPage }) => {
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

  await test.step(`Results are displayed in display area - checking first item displayed`, async () => {
    await collectionPage.infiniteScroller.checkFirstItemResult();
  });
});

test('Collection search text contents', async ({ collectionPage }) => {
  await test.step(`Select "Search text contents"`, async () => {
    await collectionPage.searchPage.clickSearchInputOption(SearchOption.TEXT);
  });

  await test.step(`Query for "dragnet"`, async () => {
    await collectionPage.searchPage.queryFor('dragnet');
  });

  await test.step(`Total result count is displayed`, async () => {
    await collectionPage.collectionFacets.checkResultCount();
  });

  await test.step(`Results are displayed in display area - checking first item displayed`, async () => {
    await collectionPage.infiniteScroller.checkFirstItemResult();
  });
});

test('No results page displays when no results', async ({ collectionPage }) => {
  await test.step(`Select "Search metadata"`, async () => {
    await collectionPage.searchPage.clickSearchInputOption(
      SearchOption.METADATA,
    );
  });

  await test.step(`Query for "catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda"`, async () => {
    await collectionPage.searchPage.queryFor(
      'catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda',
    );
  });

  await test.step(`The "No results" placeholder appears in place of the display area`, async () => {
    await collectionPage.searchPage.checkEmptyPagePlaceholder();
  });
});

test('Clearing collection search query', async ({ collectionPage }) => {
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

  await test.step(`Results are displayed in display area - checking first item displayed`, async () => {
    await collectionPage.infiniteScroller.checkFirstItemResult();
  });

  await test.step(`Click "X" button in search input`, async () => {
    await collectionPage.searchPage.clickClearSearchInput();
  });

  await test.step(`Assert "Clear all filters" is not visible`, async () => {
    await collectionPage.searchPage.assertClearSearchInputNotVisible();
  });
});
