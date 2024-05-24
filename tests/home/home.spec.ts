import { test } from '../fixtures';

import { SearchOption } from '../models';

test.fixme('Home page displays all of its elements', async ({ homePage }) => {
  await test.step('Validate if page elements were loaded', async () => {
    await homePage.validatePageElements();
  });
});

test('Do simple metadata search', async ({ homePage }) => {
  await test.step(`Query for "cats" and validate that "cats" appears as the search term `, async () => {
    await homePage.collectionBrowser.queryFor('cats');
    await homePage.collectionBrowser.validateSearchInput('cats');
  });
});

test('Do simple full-text search', async ({ homePage }) => {
  await test.step(`Select text contents in search options, query for "dogs" and validate that "dogs" appears as the search term`, async () => {
    await homePage.collectionBrowser.clickSearchInputOption(SearchOption.TEXT);
    await homePage.collectionBrowser.queryFor('dogs');
    await homePage.collectionBrowser.validateSearchInput('dogs');
  });
});

test.fixme('Do simple TV search', async ({ homePage }) => {
  await test.step(`Select TV in search options, query for "iguanas" and validate that "iguanas" appears as the search term`, async () => {
    await homePage.collectionBrowser.clickSearchInputOption(SearchOption.TV);
    await homePage.collectionBrowser.queryFor('iguanas');
    await homePage.collectionBrowser.validateTVPage('iguanas');
  });
});

test.fixme('Do simple radio search', async ({ homePage }) => {
  await test.step(`Select radio in search options, query for "rabbits" and validate that "rabbits" appears as the search term`, async () => {
    await homePage.collectionBrowser.clickSearchInputOption(SearchOption.RADIO);
    await homePage.collectionBrowser.queryFor('rabbits');
    await homePage.collectionBrowser.validateRadioPage('rabbits');
  });
});

test.fixme('Redirect web search to Wayback machine page', async ({ homePage }) => {
  await test.step(`Select TV in search options, query for "parrots" and validate that "parrots" appears as the search term`, async () => {
    await homePage.collectionBrowser.clickSearchInputOption(SearchOption.WEB);
    await homePage.collectionBrowser.queryFor('parrots');
    await homePage.collectionBrowser.validateWaybackPage('parrots');
  });
});

test.fixme('Use Wayback widget - Redirect web search', async ({ homePage }) => {
  await test.step(`Search for "canaries" and validate that "canaries" appears as the search term`, async () => {
    await homePage.waybackSearchFor('canaries');
    await homePage.collectionBrowser.validateWaybackPage('canaries');
  });
});
