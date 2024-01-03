import { test, expect, Page } from '@playwright/test';

import { 
  doASearchPageQuery, 
  navigateThruInfiniteScrollerViewModes 
} from './search-base';

let page: Page;

const startURL = 'https://archive.org/search';
const queryURL = 'https://archive.org/search?query=cats';

const sortTextList = [
  'Relevance',
  'Weekly views', 
  'Title', 
  'Date published', 
  'Creator'
];

test.describe('Search Page - page load and URL changes', () => {
  test.describe.configure({ mode: 'serial' });

  test('Go to search page and do a simple query', async ({ browser }) => {
    page = await browser.newPage();
    await doASearchPageQuery(page, startURL, 'cats');
    expect(page.url()).toBe(queryURL);
  });

  test('Should display result count and different facet groups', async () => {
    const facetsContainer = page.locator('div#facets-container');
    const facetGroups = facetsContainer.locator('section.facet-group');
    const headerTitles = facetsContainer.locator('h3');

    // loading results count
    expect(await page.innerText('#big-results-count')).toBe('Searching…');
    expect(await page.innerText('#big-results-label')).toEqual('');

    await page.waitForTimeout(3000);
  
    const resultCount = await page.innerText('#big-results-count');
    const actualTotalCount = parseFloat(resultCount.replace(/,/g, ''));
    expect(actualTotalCount).toBeGreaterThan(60000);
    expect(await page.innerText('#big-results-label')).toEqual('Results');

    // assert facet group header count
    expect(await facetGroups.count()).toEqual(8);
    expect(await headerTitles.count()).toEqual(8);
  });

  test('Navigate through different search view modes', async () => {
    await navigateThruInfiniteScrollerViewModes(page);
  });

  test.describe('Select different sort filters', () => {
    
  });

  // test('select different sort filters URL changes', async () => {
  //   await page.waitForTimeout(5000);
  //   expect(page.url()).toBe(queryURL);

  //   const infiniteScroller = page.locator('infinite-scroller');
  //   const sortFilterBar = page.locator('sort-filter-bar');
  //   const sortContainer = sortFilterBar.locator('#container');
  //   const sortBarSection = sortFilterBar.locator('section#sort-bar');

  //   expect(await infiniteScroller.count()).toEqual(1);
  //   expect(await sortFilterBar.count()).toEqual(1);
  //   expect(await sortContainer.count()).toEqual(1);
  //   expect(await sortBarSection.count()).toEqual(1);

  //   const sortDirectionContainer = sortBarSection.locator('.sort-direction-container');
  //   const sortByText = sortBarSection.locator('.sort-by-text');
  //   const sortDirectionSelector = sortDirectionContainer.locator('.sort-direction-selector');
  //   const srOnlySortDirection = sortDirectionContainer.locator('.sr-only');

  //   expect(await sortDirectionContainer.count()).toEqual(1);
  //   expect(await sortByText.count()).toEqual(1);
  //   expect(await sortDirectionSelector.count()).toEqual(1);
  //   expect(await srOnlySortDirection.count()).toEqual(1);

  //   expect(await sortByText.innerText()).toEqual('Sort by:');
  //   expect(await srOnlySortDirection.innerText()).toEqual('Change to ascending sort');

  //   const sortSelectorContainer = sortBarSection.locator('div#sort-selector-container');
  //   const mobileSort = sortSelectorContainer.locator('#mobile-sort-container');
  //   const desktopSort = sortSelectorContainer.locator('#desktop-sort-container');
    
  //   const desktopSortSelector = desktopSort.locator('#desktop-sort-selector');
  //   const desktopSortSelectorTexts = await desktopSort.locator('ul#desktop-sort-selector').allInnerTexts();
  //   const desktopSortTexts = Object.assign([], desktopSortSelectorTexts[0].split('\n'));

  //   await desktopSortSelector.click();
  //   await expect(page).toHaveURL(/sort=title/);

  //   await page.waitForTimeout(5000);
  //   expect(await srOnlySortDirection.innerText()).toEqual('Change to descending sort');

  //   desktopSortTexts.forEach((text: string, ix) => {
  //     expect(text.includes(sortTextList[ix]));
  //   });
    
  //   expect(await sortSelectorContainer.count()).toEqual(1);
  //   expect(await desktopSortSelector.count()).toEqual(1);

  //   expect(await expect(mobileSort).toHaveClass(/hidden/));
  //   expect(await expect(desktopSort).toHaveClass(/visible/));

  //   // sort-bar-filter URL changes
  //   await page.getByRole('button', { name: 'Relevance' }).click();

  //   await page.getByText('Weekly views').first().click();
  //   await expect(page).toHaveURL(/query=cats&sort=-week/);

  //   await page.getByRole('button', { name: 'Toggle options Weekly views' }).getByRole('button').click();
  //   await page.getByRole('button', { name: 'All-time views' }).click();
  //   await expect(page).toHaveURL(/query=cats&sort=-downloads/);

  //   await page.getByRole('button', { name: 'Title' }).click();
  //   await expect(page).toHaveURL(/query=cats&sort=title/);

  //   await page.getByText('Date published').first().click();
  //   await expect(page).toHaveURL(/query=cats&sort=-date/);

  //   await page.getByRole('button', { name: 'Toggle options Date published' }).getByRole('button').click();
  //   await page.getByRole('button', { name: 'Date archived' }).click();
  //   await expect(page).toHaveURL(/query=cats&sort=-publicdate/);
 
  //   await page.getByRole('button', { name: 'Toggle options Date archived' }).getByRole('button').click();
  //   await page.getByRole('button', { name: 'Date reviewed' }).click();
  //   await expect(page).toHaveURL(/query=cats&sort=-reviewdate/);

  //   await page.getByRole('button', { name: 'Toggle options Date reviewed' }).getByRole('button').click();
  //   await page.getByRole('button', { name: 'Date added' }).click();
  //   await expect(page).toHaveURL(/query=cats&sort=-addeddate/);

  //   await page.getByRole('button', { name: 'Creator' }).click();
  //   await expect(page).toHaveURL(/query=cats&sort=creator/);
  // });
  
  // test('select collection-search-input options', async () => {
  //   const collectionSearchInput = page.locator('collection-search-input');
  //   const collectionSearchGo = collectionSearchInput.locator('#go-button');
  //   const buttonCollapserLocator = collectionSearchInput.locator('#button-collapser');

  //   expect(await collectionSearchInput.count()).toEqual(1);
  //   expect(await collectionSearchGo.count()).toEqual(1);

  //   const searchMetadata = buttonCollapserLocator.getByText('Search metadata');
  //   const searchTextContents = buttonCollapserLocator.getByText('Search text contents');
  //   const searchTVCaptions = buttonCollapserLocator.getByText('Search TV news captions');
  //   const searchRadioTranscripts = buttonCollapserLocator.getByText('Search radio transcripts');
  //   const searchArchivedWebSites = buttonCollapserLocator.getByText('Search archived web sites');
    
  //   expect(await searchMetadata.count()).toEqual(1);
  //   expect(await searchTextContents.count()).toEqual(1);
  //   expect(await searchTVCaptions.count()).toEqual(1);
  //   expect(await searchRadioTranscripts.count()).toEqual(1);
  //   expect(await searchArchivedWebSites.count()).toEqual(1);

  //   await searchTextContents.click();
  //   await collectionSearchGo.click();
  //   await expect(page).toHaveURL(/query=cats&sin=TXT/);

  //   await searchRadioTranscripts.click();
  //   await collectionSearchGo.click();
  //   await expect(page).toHaveURL(/query=cats&sin=RADIO/);
  // });

});
