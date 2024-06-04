import { test } from '../fixtures';

import { SearchOption } from '../models';

test(`"Begin searching" page displays prior to searching`, async ({
  searchPage,
}) => {
  await test.step(`Check if the empty page placeholder is displayed`, async () => {
    await searchPage.collectionBrowser.validateEmptyPagePlaceholder();
  });
});

test.fixme('Do simple metadata search', async ({ searchPage }) => {
  await test.step(`Select search option for metadata search and search for cats`, async () => {
    await searchPage.collectionBrowser.clickSearchInputOption(
      SearchOption.METADATA,
    );
    await searchPage.collectionBrowser.queryFor('cats');
  });

  await test.step(`Searching and search result count should be displayed`, async () => {
    await searchPage.collectionFacets.displaysResultCount();
  });
});

test.fixme('Do simple text contents search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for dogs`, async () => {
    await searchPage.collectionBrowser.clickSearchInputOption(
      SearchOption.TEXT,
    );
    await searchPage.collectionBrowser.queryFor('dogs');
  });

  await test.step(`Searching and search result count should be displayed`, async () => {
    await searchPage.collectionFacets.displaysResultCount();
  });
});

test.fixme('Do simple TV search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for iguanas`, async () => {
    await searchPage.collectionBrowser.clickSearchInputOption(SearchOption.TV);
    await searchPage.collectionBrowser.queryFor('iguanas');
  });

  await test.step(`Check TV page is displayed`, async () => {
    await searchPage.collectionBrowser.validateTVPage('iguanas');
  });
});

test.fixme('Do simple radio search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for rabbits`, async () => {
    await searchPage.collectionBrowser.clickSearchInputOption(
      SearchOption.RADIO,
    );
    await searchPage.collectionBrowser.queryFor('rabbits');
  });

  await test.step(`Check Radio search page is displayed`, async () => {
    await searchPage.collectionBrowser.validateRadioPage('rabbits');
  });
});

test.fixme('Do simple web search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for parrots`, async () => {
    await searchPage.collectionBrowser.clickSearchInputOption(SearchOption.WEB);
    await searchPage.collectionBrowser.queryFor('parrots');
  });

  await test.step(`Check Wayback search page is displayed`, async () => {
    await searchPage.collectionBrowser.validateWaybackPage('parrots');
  });
});

test.fixme('No results page displays when no results', async ({ searchPage }) => {
  await test.step(`Search for a query that we expect will return no results at all and validate the empty page placeholder is displayed`, async () => {
    await searchPage.collectionBrowser.queryFor(
      'catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda',
    );
    await searchPage.collectionBrowser.validateEmptyPagePlaceholder();
  });
});