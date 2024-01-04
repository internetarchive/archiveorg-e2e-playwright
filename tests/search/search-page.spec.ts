import { test, expect } from '@playwright/test';

import { SearchPage } from './search-page';
import { SortBar } from './sort-bar';

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
    await searchPage.navigateThruInfiniteScrollerViewModes();
  });

  test.describe('Sorting results', async() => {
    test('Sort filter list', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      const desktopSortSelectorTexts = await sortBar.sortSelector.allInnerTexts();
      const desktopSortTexts = Object.assign([], desktopSortSelectorTexts[0].split('\n'));

      desktopSortTexts.forEach((text: string, ix: number) => {
        expect(text.includes(sortTextList[ix]));
      });
    });

    // test('Sort by title - ascending order', async() => {
      
    // });

    // test('Sort by title - descending order', async() => {
      
    // });

    // test('Sort by creator - ascending order', async() => {
      
    // });

    // test('Sort by creator - descending order', async() => {
      
    // });

    test('Sort filter - Weekly views', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.textClick('Weekly views');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Relevance', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.buttonClick('Relevance');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - All-time views', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.caratButtonClick('Toggle options Weekly views');
      await sortBar.buttonClick('All-time views');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Title', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.buttonClick('Title');
      await expect(sortBar.alphaBar).toBeVisible();
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Published', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.textClick('Date published');
      await expect(sortBar.alphaBar).not.toBeVisible();
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Archived', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.caratButtonClick('Toggle options Date published');
      await sortBar.buttonClick('Date archived');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Reviewed', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.caratButtonClick('Toggle options Date archived');
      await sortBar.buttonClick('Date reviewed');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Date Added', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.caratButtonClick('Toggle options Date reviewed');
      await sortBar.buttonClick('Date added');
      await searchPage.loadingResultCount();
    });

    test('Sort filter - Creator', async () => {
      const page = searchPage.page;
      const sortBar = new SortBar(page);
      await sortBar.buttonClick('Creator');
      await expect(sortBar.alphaBar).toBeVisible();
      await searchPage.loadingResultCount();
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
  });

});
