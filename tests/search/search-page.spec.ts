import { test } from '@playwright/test';

import { SearchOption } from '../models';
import { SearchPage } from '../page-objects/search-page';

let searchPage: SearchPage;

test.describe('Basic Search tests', () => {
  test.describe.configure({ mode: 'serial' });

  test(`"Begin searching" page displays prior to searching`, async ({
    browser,
  }) => {
    const browserPage = await browser.newPage();
    searchPage = new SearchPage(browserPage);

    await test.step(`Go to archive.org/search URL`, async () => {
      await searchPage.visit();
    });

    await test.step(`Check if the empty page placeholder is displayed`, async () => {
      await searchPage.collectionBrowser.validateEmptyPagePlaceholder();
    });
  });

  test('Do simple metadata search', async () => {
    await test.step(`Select search option for metadata search`, async () => {
      await searchPage.collectionBrowser.clickSearchInputOption(
        SearchOption.METADATA,
      );
    });

    await test.step(`Search for cats`, async () => {
      await searchPage.collectionBrowser.queryFor('cats');
    });

    await test.step(`Searching and search result count should be displayed`, async () => {
      await searchPage.collectionFacets.displaysResultCount();
    });
  });

  test('Do simple text contents search', async () => {
    await test.step(`Select search option for text search`, async () => {
      await searchPage.collectionBrowser.clickSearchInputOption(
        SearchOption.TEXT,
      );
    });

    await test.step(`Search for dogs`, async () => {
      await searchPage.collectionBrowser.queryFor('dogs');
    });

    await test.step(`Searching and search result count should be displayed`, async () => {
      await searchPage.collectionFacets.displaysResultCount();
    });
  });

  test('Do simple TV search', async () => {
    await test.step(`Select search option for text search`, async () => {
      await searchPage.collectionBrowser.clickSearchInputOption(
        SearchOption.TV,
      );
    });

    await test.step(`Search for iguanas`, async () => {
      await searchPage.collectionBrowser.queryFor('iguanas');
    });

    await test.step(`Check TV page is displayed`, async () => {
      await searchPage.collectionBrowser.validateTVPage('iguanas');
    });

    await test.step(`Go back to search page from TV search page`, async () => {
      await searchPage.goBackToSearchPage();
    });
  });

  test('Do simple radio search', async () => {
    await test.step(`Select search option for text search`, async () => {
      await searchPage.collectionBrowser.clickSearchInputOption(
        SearchOption.RADIO,
      );
    });

    await test.step(`Search for iguanas`, async () => {
      await searchPage.collectionBrowser.queryFor('rabbits');
    });

    await test.step(`Check Radio search page is displayed`, async () => {
      await searchPage.collectionBrowser.validateRadioPage('rabbits');
    });

    await test.step(`Go back to search page from Radio search page`, async () => {
      await searchPage.goBackToSearchPage();
    });
  });

  test('Do simple web search', async () => {
    await test.step(`Select search option for text search`, async () => {
      await searchPage.collectionBrowser.clickSearchInputOption(
        SearchOption.WEB,
      );
    });

    await test.step(`Search for parrots`, async () => {
      await searchPage.collectionBrowser.queryFor('parrots');
    });

    await test.step(`Check Wayback search page is displayed`, async () => {
      await searchPage.collectionBrowser.validateWaybackPage('parrots');
    });

    await test.step(`Go back to search page from Wayback search page`, async () => {
      await searchPage.goBackToSearchPage();
    });
  });

  test('No results page displays when no results', async () => {
    await test.step(`Search for a query that we expect will return no results at all and validate the empty page placeholder is displayed`, async () => {
      await searchPage.collectionBrowser.queryFor(
        'catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda',
      );
      await searchPage.collectionBrowser.validateEmptyPagePlaceholder();
    });
  });
});

test.afterAll(async () => {
  await searchPage.page.close();
});
