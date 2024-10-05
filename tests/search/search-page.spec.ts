import { test } from '../fixtures';

import { SearchOption } from '../models';

test.skip(`"Begin searching" page displays prior to searching`, async ({
  searchPage,
}) => {
  await test.step(`Check if the empty page placeholder is displayed`, async () => {
    await searchPage.collectionBrowser.validateEmptyPagePlaceholder();
  });
});

test.skip('Do simple metadata search', async ({ searchPage }) => {
  await test.step(`Select search option for metadata search and search for cats`, async () => {
    await searchPage.collectionSearchInput.clickSearchInputOption(
      SearchOption.METADATA, 'search'
    );
    await searchPage.collectionSearchInput.queryFor('cats');
  });

  await test.step(`Searching and search result count should be displayed`, async () => {
    await searchPage.collectionFacets.displaysResultCount();
  });
});

test.skip('Do simple text contents search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for dogs`, async () => {
    await searchPage.collectionSearchInput.clickSearchInputOption(
      SearchOption.TEXT, 'search'
    );
    await searchPage.collectionSearchInput.queryFor('dogs');
  });

  await test.step(`Searching and search result count should be displayed`, async () => {
    await searchPage.collectionFacets.displaysResultCount();
  });
});

test.skip('Do simple TV search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for iguanas`, async () => {
    await searchPage.collectionSearchInput.clickSearchInputOption(SearchOption.TV, 'search');
    await searchPage.collectionSearchInput.queryFor('iguanas');
  });

  await test.step(`Check TV page is displayed`, async () => {
    await searchPage.collectionBrowser.validateTVPage('iguanas');
  });
});

test.skip('Do simple radio search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for rabbits`, async () => {
    await searchPage.collectionSearchInput.clickSearchInputOption(
      SearchOption.RADIO, 'search'
    );
    await searchPage.collectionSearchInput.queryFor('rabbits');
  });

  await test.step(`Check Radio search page is displayed`, async () => {
    await searchPage.collectionBrowser.validateRadioPage('rabbits');
  });
});

test.skip('Do simple web search', async ({ searchPage }) => {
  await test.step(`Select search option for text search and search for parrots`, async () => {
    await searchPage.collectionSearchInput.clickSearchInputOption(SearchOption.WEB, 'search');
    await searchPage.collectionSearchInput.queryFor('parrots');
  });

  await test.step(`Check Wayback search page is displayed`, async () => {
    await searchPage.collectionBrowser.validateWaybackPage('parrots');
  });
});

test.skip('No results page displays when no results', async ({ searchPage }) => {
    await test.step(`Search for a query that we expect will return no results at all and validate the empty page placeholder is displayed`, async () => {
      await searchPage.collectionSearchInput.queryFor(
        'catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda',
      );
      await searchPage.collectionBrowser.validateEmptyPagePlaceholder();
    });
  },
);