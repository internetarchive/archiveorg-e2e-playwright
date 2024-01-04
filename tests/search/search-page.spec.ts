import { test, expect } from '@playwright/test';

import { SearchPage } from './search-page';

import { navigateThruInfiniteScrollerViewModes } from './search-base';

let searchPage: SearchPage;

const queryURL = 'https://archive.org/search?query=cats';

const sortTextList = [
  'Relevance',
  'Weekly views', 
  'Title', 
  'Date published', 
  'Creator'
];

test.describe('Search Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('Go to search page and do a simple query', async ({ browser }) => {
    const browserPage = await browser.newPage();
    searchPage = new SearchPage(browserPage);
  
    const page = searchPage.page;
    await searchPage.visit();
    await searchPage.search('cats');
    await page.waitForLoadState();
    expect(page.url()).toBe(queryURL);
  });

  test.describe('Facets navigation', async () => {
    test('Should display result count and different facet groups', async () => {
      await searchPage.loadingResultCount();
  
      const facetsContainer = searchPage.facetsContainer;
      const facetGroups = facetsContainer.locator('section.facet-group');
      const headerTitles = facetsContainer.locator('h3');
  
      // assert facet group header count
      expect(await facetGroups.count()).toEqual(8);
      expect(await headerTitles.count()).toEqual(8);
    });
  })

  test('Navigate through different search view modes', async () => {
    await navigateThruInfiniteScrollerViewModes(searchPage.page);
  });

  test.describe('Sorting results', async() => {
    test('Desktop sort filter texts', async () => {
      const browserPage = searchPage.page;
      const sortBarSection = searchPage.sortFilterBar;
      const sortDirectionContainer = sortBarSection.locator('.sort-direction-container');
      const sortByText = sortBarSection.locator('.sort-by-text');
      const srOnlySortDirection = sortDirectionContainer.locator('.sr-only');

      const sortSelectorContainer = sortBarSection.locator('div#sort-selector-container');
      const desktopSort = sortSelectorContainer.locator('#desktop-sort-container');
      
      const desktopSortSelector = desktopSort.locator('#desktop-sort-selector');
      const desktopSortSelectorTexts = await desktopSort.locator('ul#desktop-sort-selector').allInnerTexts();
      const desktopSortTexts = Object.assign([], desktopSortSelectorTexts[0].split('\n'));
  
      expect(await sortByText.innerText()).toEqual('Sort by:');
      expect(await srOnlySortDirection.innerText()).toEqual('Change to ascending sort');

      await desktopSortSelector.click();
      await expect(browserPage).toHaveURL(/sort=title/);

      await browserPage.waitForLoadState();
      expect(await srOnlySortDirection.innerText()).toEqual('Change to descending sort');

      desktopSortTexts.forEach((text: string, ix) => {
        expect(text.includes(sortTextList[ix]));
      });
    });

    test('Sort filter - Relevance', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Relevance' }).click();
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Weekly views', async () => {
      const page = searchPage.page;
      await page.getByText('Weekly views').first().click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=-week/);
    });

    test('Sort filter - All-time views', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Toggle options Weekly views' }).getByRole('button').click();
      await page.getByRole('button', { name: 'All-time views' }).click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=-downloads/);
    });

    test('Sort filter - Title', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Title' }).click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=title/);
    });

    test('Sort filter - Date Published', async () => {
      const page = searchPage.page;
      await page.getByText('Date published').first().click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=-date/);
    });

    test('Sort filter - Date Archived', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Toggle options Date published' }).getByRole('button').click();
      await page.getByRole('button', { name: 'Date archived' }).click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=-publicdate/);
    });

    test('Sort filter - Date Reviewed', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Toggle options Date archived' }).getByRole('button').click();
      await page.getByRole('button', { name: 'Date reviewed' }).click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=-reviewdate/);
    });

    test('Sort filter - Date Added', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Toggle options Date reviewed' }).getByRole('button').click();
      await page.getByRole('button', { name: 'Date added' }).click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=-addeddate/);
    });

    test('Sort filter - Creator', async () => {
      const page = searchPage.page;
      await page.getByRole('button', { name: 'Creator' }).click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sort=creator/);
    });
  });

  // still need to rename this
  test.describe('Search input options', async () => {
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

    test('Search text contents', async () => {
      const page = searchPage.page;
      const btnCollapser = searchPage.btnCollectionSearchInputCollapser;

      const searchText = btnCollapser.getByText('Search text contents');
      await searchText.click();
      await searchPage.btnCollectionSearchInputGo.click();
      await searchPage.loadingResultCount();
      await expect(page).toHaveURL(/query=cats&sin=TXT/);
    });
  });

});
