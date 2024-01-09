import { test, expect } from '@playwright/test';

import { SearchPage } from './search-page';

import { SortBar } from '../shared/sort-bar';

let searchPage: SearchPage;
let sortBar: SortBar;

test.describe('Metadata - Search page results display', () => {
  test.describe.configure({ mode: 'serial' });

  test('Go to search page and do a simple query', async ({ browser }) => {
    const browserPage = await browser.newPage();
    searchPage = new SearchPage(browserPage);
    sortBar = new SortBar(searchPage.page);

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
    test('Sort by weekly views, descending order', async () => {
      await searchPage.navigateSortBy('Weekly views', 'descending');
    });

    test('Sort by relevance, descending order', async () => {
      await searchPage.navigateSortBy('Relevance', 'descending');
    });

    test('Sort by all-time views, ascending order', async () => {
      await searchPage.navigateSortBy('All-time views', 'ascending');
    });

    test('Sort by title, descending order', async() => {
      await searchPage.navigateSortBy('Title', 'descending');
    });

    test('Sort by date published, ascending order', async () => {
      await searchPage.navigateSortBy('Date published', 'ascending');
    });

    test('Sort by date archived, ascending order', async () => {
      await searchPage.navigateSortBy('Date archived', 'ascending');
    });

    test('Sort by date reviewed, ascending order', async () => {
      await searchPage.navigateSortBy('Date reviewed', 'ascending');
    });

    test('Sort by date added, ascending order', async () => {
      await searchPage.navigateSortBy('Date added', 'ascending');
    });

    test('Sort by creator, ascending order', async () => {
      await searchPage.navigateSortBy('Creator', 'descending');
    });

    test('Sort by creator name that starts with letter B', async () => {
      await sortBar.clickAlphaBarLetterByPosition(1);
    });

    test('Sort by creator name that starts with letter K', async () => {
      await sortBar.clickAlphaBarLetterByPosition(10);
    });

    test('Clear applied creator name letter sort filter', async () => {
      await searchPage.clearAllFilters();
    });
  });

  test.describe('Search type options', async () => {
    test('Should display different collection search input options', async () => {
      await searchPage.checkSearchInputOptions();
    });
  });

});
