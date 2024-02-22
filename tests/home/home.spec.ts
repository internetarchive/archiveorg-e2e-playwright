import { test } from '../fixtures';

import { LayoutViewModeLocator, SearchOption } from '../models';

test('Home page displays all of its elements', async ({homePage}) => {
  await test.step('Validate if page elements were loaded', async () => {
    await homePage.validatePageElements();
  });
});

test('Do simple metadata search', async ({homePage}) => {
  await test.step(`Query for "cats" and validate that "cats" appears as the search term `, async () => {
    await homePage.searchPage.queryFor('cats');
    await homePage.searchPage.validateSearchInput('cats');
  });
});

test('Do simple full-text search', async ({homePage}) => {
  await test.step(`Select text contents in search options, query for "dogs" and validate that "dogs" appears as the search term`, async () => {
    await homePage.searchPage.clickSearchInputOption(SearchOption.TEXT);
    await homePage.searchPage.queryFor('dogs');
    await homePage.searchPage.validateSearchInput('dogs');
  });
});

test('Do simple TV search', async ({homePage}) => {
  await test.step(`Select TV in search options, query for "iguanas" and validate that "iguanas" appears as the search term`, async () => {
    await homePage.searchPage.clickSearchInputOption(SearchOption.TV);
    await homePage.searchPage.queryFor('iguanas');
    await homePage.searchPage.validateTVPage('iguanas');
  });
});

test('Do simple radio search', async ({homePage}) => {
  await test.step(`Select radio in search options, query for "rabbits" and validate that "rabbits" appears as the search term`, async () => {
    await homePage.searchPage.clickSearchInputOption(SearchOption.RADIO);
    await homePage.searchPage.queryFor('rabbits');
    await homePage.searchPage.validateRadioPage('rabbits');
  });
});

test('Redirect web search to Wayback machine page', async ({homePage}) => {
  await test.step(`Select TV in search options, query for "parrots" and validate that "parrots" appears as the search term`, async () => {
    await homePage.searchPage.clickSearchInputOption(SearchOption.WEB);
    await homePage.searchPage.queryFor('parrots');
    await homePage.searchPage.validateWaybackPage('parrots');
  });
});

test.skip('Use Wayback widget - Redirect web search', async ({homePage}) => {
  await test.step('', async () => {
    
  });
});
