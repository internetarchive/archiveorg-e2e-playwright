import { test } from '../fixtures';
import { SearchOption } from '../models';

test('Collection search metadata', async ({ collectionPage }) => {
  await test.step(`Select "Search metadata"`, async () => {
    await collectionPage.collectionBrowser.clickSearchInputOption(
      SearchOption.METADATA, 'collection'
    );
  });

  await test.step(`Search for "radio" in the search input text field`, async () => {
    await collectionPage.collectionBrowser.queryFor('radio');
  });

  await test.step(`Results are displayed in display area - validate first item displayed`, async () => {
    await collectionPage.collectionFacets.displaysResultCount();
    await collectionPage.infiniteScroller.displaysFirstResult();
  });
});

test('Collection search text contents and clear filters', async ({
  collectionPage,
}) => {
  await test.step(`Select "Search text contents"`, async () => {
    await collectionPage.collectionBrowser.clickSearchInputOption(
      SearchOption.TEXT, 'collection'
    );
  });

  await test.step(`Search for "dragnet" in the search input text field`, async () => {
    await collectionPage.collectionBrowser.queryFor('dragnet');
  });

  await test.step(`Results are displayed in display area - validate first item displayed`, async () => {
    await collectionPage.collectionFacets.displaysResultCount();
    await collectionPage.infiniteScroller.displaysFirstResult();
  });

  await test.step(`Click "X" button in search input and validate search input text is cleared`, async () => {
    await collectionPage.collectionBrowser.clickClearSearchInput();
    await collectionPage.collectionBrowser.validateClearSearchInput();
  });
});

test('No results page displays when no results', async ({ collectionPage }) => {
  await test.step(`Select "Search metadata"`, async () => {
    await collectionPage.collectionBrowser.clickSearchInputOption(
      SearchOption.METADATA, 'collection'
    );
  });

  await test.step(`Search for "catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda" and validate that the "No results" placeholder appears in place of the display area`, async () => {
    await collectionPage.collectionBrowser.queryFor(
      'catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda',
    );
    await collectionPage.collectionBrowser.validateEmptyPagePlaceholder();
  });
});
