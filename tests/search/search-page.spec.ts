import { test, expect } from '@playwright/test';

import { SearchPage } from './search-page';

import { SortBar } from '../shared/sort-bar';

let searchPage: SearchPage;

test.describe('Search Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('Go to search page and do a simple query', async ({ browser }) => {
    const browserPage = await browser.newPage();
    searchPage = new SearchPage(browserPage);

    await searchPage.visit();
    await searchPage.search('cats');
  });

  test.describe('Facets navigation', async () => {
    test('Should display result count and different facet groups', async () => {
      await searchPage.checkFacetGroups();
    });
  })

  test('Navigate through different search view modes', async () => {
    await searchPage.navigateThruInfiniteScrollerViewModes();
  });

  test.describe('Sorting results', async() => {
    test('Sort filter - Weekly views in descending order', async () => {
      await searchPage.navigateSortBy('Weekly views', 'descending');
    });

    test('Sort filter - Relevance in descending order', async () => {
      await searchPage.navigateSortBy('Relevance', 'descending');
    });

    test('Sort filter - All-time views in ascending order', async () => {
      await searchPage.navigateSortBy('All-time views', 'ascending');
    });

    test('Select filter - Title in descending order', async() => {
      await searchPage.navigateSortBy('Title', 'descending');
    });

    test('Sort filter - Date Published', async () => {
      await searchPage.navigateSortBy('Date published', 'ascending');
    });

    test('Sort filter - Date Archived in ascending order', async () => {
      await searchPage.navigateSortBy('Date archived', 'ascending');
    });

    test('Sort filter - Date Reviewed in ascending order', async () => {
      await searchPage.navigateSortBy('Date reviewed', 'ascending');
    });

    test('Sort filter - Date Added in ascending order', async () => {
      await searchPage.navigateSortBy('Date added', 'ascending');
    });

    test('Sort filter - Creator in descending order', async () => {
      await searchPage.navigateSortBy('Creator', 'descending');
    });

    test('Alphabet letter sorting by position', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);

      await sortBar.clickAlphaBarLetterByPosition(1);
      await sortBar.clickAlphaBarLetterByPosition(10);
    });

    test('Clear applied filters', async () => {
      await searchPage.clearAllFilters();
    });
  });

  test.describe('Search type options', async () => {
    test('Check different collection search input options', async () => {
      await searchPage.checkSearchInputOptions();
    });
  });

});
