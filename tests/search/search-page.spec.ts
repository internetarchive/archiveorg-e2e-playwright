import { test } from '@playwright/test';

import { SearchOption, SearchPage } from './search-page';

let searchPage: SearchPage;

test.describe('Search page tests', () => {
  test.describe.configure({ mode: 'serial' });

  test(`"Begin searching" page displays prior to searching`, async({ browser }) => {
    const browserPage = await browser.newPage();
    searchPage = new SearchPage(browserPage);

    await searchPage.visit();
    await searchPage.checkEmptyPagePlaceholder();
  });

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
    await searchPage.queryFor('iguanas');
    await searchPage.checkTVPage('iguanas');
  });

  test('Go back to search page from TV page', async () => {
    await searchPage.goBackToSearchPage();
  });

  test('Do simple radio search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.RADIO);
    await searchPage.queryFor('rabbits');
    await searchPage.checkRadioPage('rabbits');
  });

  test('Go back to search page from radio page', async () => {
    await searchPage.goBackToSearchPage();
  });

  test('Do simple web search', async () => {
    await searchPage.clickSearchInputOption(SearchOption.WEB);
    await searchPage.queryFor('parrots');
    await searchPage.checkWaybackPage('parrots');
  });

  test('Go back to search page from Wayback page', async () => {
    await searchPage.goBackToSearchPage();
  });

  test('No results page displays when no results', async () => {
    await searchPage.queryFor('catsshfksahfkjhfkjsdhfkiewhkdsfahkjhfkjsda');
    await searchPage.checkEmptyPagePlaceholder();
  });

});
