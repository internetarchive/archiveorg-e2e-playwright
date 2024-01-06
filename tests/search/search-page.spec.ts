import { test, expect } from '@playwright/test';

import { SearchPage } from './search-page';
import { SortBar } from './sort-bar';

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
      await searchPage.loadingResultCount();
      await searchPage.checkFacetGroups();
    });
  })

  test('Navigate through different search view modes', async () => {
    await searchPage.navigateThruInfiniteScrollerViewModes();
  });

  test.describe('Sorting results', async() => {
    test('Sort filter - Weekly views', async () => {
      await searchPage.navigateSortBy('Weekly views');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Relevance', async () => {
      await searchPage.navigateSortBy('Relevance');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - All-time views', async () => {
      await searchPage.navigateSortBy('All-time views');
      await searchPage.loadingResultCount();
    });

    test('Select filter - Title', async() => {
      await searchPage.navigateSortBy('Title');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Published', async () => {
      await searchPage.navigateSortBy('Date published');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Archived', async () => {
      await searchPage.navigateSortBy('Date archived');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Reviewed', async () => {
      await searchPage.navigateSortBy('Date reviewed');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Added', async () => {
      await searchPage.navigateSortBy('Date added');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Creator', async () => {
      await searchPage.navigateSortBy('Creator');
      await searchPage.loadingResultCount();
    });

    test.describe('Sort direction', async () => {
      test('By ascending order', async () => {
        const page = searchPage.page;
        const sortBar = new SortBar(page);
        await sortBar.clickSortDirection();
        await expect(sortBar.srSortText).toContainText('Change to ascending sort');
        await searchPage.loadingResultCount();
      });

      test('By descending order', async () => {
        const page = searchPage.page;
        const sortBar = new SortBar(page);
        await sortBar.clickSortDirection();
        await expect(sortBar.srSortText).toContainText('Change to descending sort');
        await searchPage.loadingResultCount();
      });
    });

    test('Alphabet letter sorting by position', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);

      await sortBar.clickAlphaBarLetterByPosition(1);
      await page.waitForLoadState();

      await sortBar.clickAlphaBarLetterByPosition(10);
      await page.waitForLoadState();
      await page.waitForTimeout(3000);
    });

    test('Clear applied filters', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);

      await searchPage.clearAllFilters();
      await sortBar.clearAlphaBarFilter();
    });
  });

  test.describe('Search type options', async () => {
    test('Check different collection search input options', async () => {
      await expect(searchPage.collectionSearchInput).toBeVisible();
      await expect(searchPage.btnCollectionSearchInputGo).toBeVisible();
      await expect(searchPage.btnCollectionSearchInputCollapser).toBeVisible();

      const options = searchPage.btnCollectionSearchInputCollapser.locator('ul > li > label > span');
      await expect(options).toHaveText([
        `Search metadata`,
        `Search text contents`,
        `Search TV news captions`,
        `Search radio transcripts`,
        `Search archived web sites`,
      ]);
    });
  });

});
