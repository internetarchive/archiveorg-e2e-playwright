import { test } from '../fixtures';

import { SearchOption } from '../models';

test('Home page displays all of its elements', async ({ homePage }) => {
  await test.step('Validate if page elements were loaded', async () => {
    await homePage.validatePageElements();
  });
});

test('Do simple metadata search', async ({ homePage }) => {
  await test.step(`Query for "cats" and validate that "cats" appears as the search term `, async () => {
    await homePage.collectionSearchInput.queryFor('cats');
    await homePage.collectionSearchInput.validateSearchInput('cats');
  });
});

test('Do simple full-text search', async ({ homePage }) => {
  await test.step(`Select text contents in search options, query for "dogs" and validate that "dogs" appears as the search term`, async () => {
    await homePage.collectionSearchInput.clickSearchInputOption(
      SearchOption.TEXT, 'search',
    );
    await homePage.collectionSearchInput.queryFor('dogs');
    await homePage.collectionSearchInput.validateSearchInput('dogs');
  });
});

test('Do simple TV search', async ({ homePage }) => {
  await test.step(`Select TV in search options, query for "iguanas" and validate that "iguanas" appears as the search term`, async () => {
    await homePage.collectionSearchInput.clickSearchInputOption(
      SearchOption.TV, 'search',
    );
    await homePage.collectionSearchInput.queryFor('iguanas');
    await homePage.collectionBrowser.validateTVPage('iguanas');
  });
});

test('Do simple radio search', async ({ homePage }) => {
  await test.step(`Select radio in search options, query for "rabbits" and validate that "rabbits" appears as the search term`, async () => {
    await homePage.collectionSearchInput.clickSearchInputOption(
      SearchOption.RADIO, 'search',
    );
    await homePage.collectionSearchInput.queryFor('rabbits');
    await homePage.collectionBrowser.validateRadioPage('rabbits');
  });
});

test('Redirect web search to Wayback machine page', async ({ homePage }) => {
  await test.step(`Select TV in search options, query for "parrots" and validate that "parrots" appears as the search term`, async () => {
    await homePage.collectionSearchInput.clickSearchInputOption(
      SearchOption.WEB, 'search',
    );
    await homePage.collectionSearchInput.queryFor('parrots');
    await homePage.collectionBrowser.validateWaybackPage('parrots');
  });
});

test('Use Wayback widget - Redirect web search', async ({ homePage }) => {
  await test.step(`Search for "canaries" and validate that "canaries" appears as the search term`, async () => {
    await homePage.waybackSearchFor('canaries');
    await homePage.collectionBrowser.validateWaybackPage('canaries');
  });
});
