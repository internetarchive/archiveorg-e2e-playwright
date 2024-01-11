import { test } from '@playwright/test';

import { EmptyPlaceHolderText, SearchOption, SearchPage } from './search-page';

let searchPage: SearchPage;

test.describe('Metadata - Search page results display', () => {
  test.describe.configure({ mode: 'serial' });

  test('Display begin searching page displays prior to searching', async({ browser }) => {
    const browserPage = await browser.newPage();
    searchPage = new SearchPage(browserPage);

    await searchPage.visit();
    await searchPage.checkPagePlaceholder(EmptyPlaceHolderText.BEGIN);
  });

  test('Verify search input options displayed', async () => {
    await searchPage.checkSearchInputOptions();
  })

  test('Do simple metadata search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.METADATA);
    await searchPage.queryFor('cats');
    await searchPage.displayResultCount();
  });

  test('Do simple text contents search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.TEXT);
    await searchPage.queryFor('dogs');
    await searchPage.displayResultCount();
  });

  test('Do simple TV search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.TV);
    await searchPage.queryFor('cats');
    await searchPage.checkTVPage();
  });

  test('Do simple radio search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.RADIO);
    await searchPage.queryFor('rabbit');
    await searchPage.checkRadioPage();
  });

  test('Do simple web search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.WEB);
    await searchPage.queryFor('funny cats');
    await searchPage.checkWaybackPage();
  });

  test('No results page displays when no results', async () => {
    await searchPage.queryFor('catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda');
    await searchPage.checkPagePlaceholder(EmptyPlaceHolderText.EMPTY);
  })

});
