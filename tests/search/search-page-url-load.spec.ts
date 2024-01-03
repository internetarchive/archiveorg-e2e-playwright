/* Scenario: 
Search Page initial page load and URL 

Scenario Description: 
User will do a search query and navigate thru different page sorting and filters

Test Steps:
1. User is on the Search Page
2. Enters a query
3. Wait for the page to load with the results
4. Verify the search page query URL
5. User will check different facet groups
6. User clicks on the different view modes
7. User clicks on the different sort filters and verify that the URL changes
8. User clicks on the different collection-search-input radio buttons and verify that the URL changes
*/


import { test, expect, Page } from '@playwright/test';

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

  test('go to search page and do a simple query', async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(startURL);
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/search/);
  
    expect(await page.locator('#search-bar-container').count()).toEqual(1);
    expect(await page.locator('#search_options').count()).toEqual(1);
    expect(await page.locator('#action-bar-spacing').count()).toEqual(1);
    expect(await page.locator('#go-button').count()).toEqual(1);
  
    expect(await page.locator('empty-placeholder').count()).toEqual(1);
    expect(await page.getByRole('heading', {
      name: 'To begin searching, enter a search term in the box above and hit "Go".'
    }).count()).toEqual(1);
    expect(await page.locator('#content-container svg').count()).toEqual(1);
  
    const searchInput = page.getByRole('textbox', {
      name: 'Search the Archive. Filters and Advanced Search available below.'
    });
  
    await searchInput.fill('cats');
    await searchInput.press('Enter');
  
    await page.waitForURL(queryURL);
  });

  test('check different facet groups', async () => {
    await page.waitForTimeout(3000);
    expect(page.url()).toBe(queryURL);

    const leftColumn = page.locator('div#left-column.column');
    const facetsHeaderContainer = page.locator('div#facets-header-container');
    const facetsContainer = page.locator('div#facets-container');
    const facetGroups = facetsContainer.locator('section.facet-group');
    const headerTitles = facetsContainer.locator('h3');

    expect(await leftColumn.count()).toEqual(1);
    expect(await facetsHeaderContainer.count()).toEqual(1);
    expect(await facetsContainer.count()).toEqual(1);
    expect(await facetGroups.count()).toEqual(8);
    expect(await headerTitles.count()).toEqual(8);
  });

  test('navigate through different search view modes', async () => {
    const infiniteScroller = page.locator('infinite-scroller');
    const sortFilterBar = page.locator('sort-filter-bar');
    const sortBarSection = sortFilterBar.locator('section#sort-bar');

    const displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    const displayStyleSelectorOptions = displayStyleSelector.locator('ul > li');

    expect(await displayStyleSelector.count()).toEqual(1);
    expect(await displayStyleSelectorOptions.count()).toEqual(3);
    expect(await displayStyleSelectorOptions.nth(0).locator('#grid-button').count()).toEqual(1);
    expect(await displayStyleSelectorOptions.nth(1).locator('#list-detail-button').count()).toEqual(1);
    expect(await displayStyleSelectorOptions.nth(2).locator('#list-compact-button').count()).toEqual(1);

    // view mode - default grid view
    expect(await expect(infiniteScroller).toHaveClass(/grid/));
    await expect(infiniteScroller.locator('item-tile').first()).toBeVisible();
    await expect(infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();

    // view mode - click list-detail
    await displayStyleSelectorOptions.nth(1).click();
    await expect(infiniteScroller).toHaveClass(/list-detail/);
    await expect(infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(infiniteScroller.locator('tile-list').first()).toBeVisible();
    await expect(infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();

    // view mode - click list-compact
    await displayStyleSelectorOptions.nth(2).click();
    await expect(infiniteScroller).toHaveClass(/list-compact/);
    await expect(infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(infiniteScroller.locator('tile-list-compact').first()).toBeVisible();
  })

  test('select different sort filters URL changes', async () => {
    await page.waitForTimeout(5000);
    expect(page.url()).toBe(queryURL);

    const infiniteScroller = page.locator('infinite-scroller');
    const sortFilterBar = page.locator('sort-filter-bar');
    const sortContainer = sortFilterBar.locator('#container');
    const sortBarSection = sortFilterBar.locator('section#sort-bar');

    expect(await infiniteScroller.count()).toEqual(1);
    expect(await sortFilterBar.count()).toEqual(1);
    expect(await sortContainer.count()).toEqual(1);
    expect(await sortBarSection.count()).toEqual(1);

    const sortDirectionContainer = sortBarSection.locator('.sort-direction-container');
    const sortByText = sortBarSection.locator('.sort-by-text');
    const sortDirectionSelector = sortDirectionContainer.locator('.sort-direction-selector');
    const srOnlySortDirection = sortDirectionContainer.locator('.sr-only');

    expect(await sortDirectionContainer.count()).toEqual(1);
    expect(await sortByText.count()).toEqual(1);
    expect(await sortDirectionSelector.count()).toEqual(1);
    expect(await srOnlySortDirection.count()).toEqual(1);

    expect(await sortByText.innerText()).toEqual('Sort by:');
    expect(await srOnlySortDirection.innerText()).toEqual('Change to ascending sort');

    const sortSelectorContainer = sortBarSection.locator('div#sort-selector-container');
    const mobileSort = sortSelectorContainer.locator('#mobile-sort-container');
    const desktopSort = sortSelectorContainer.locator('#desktop-sort-container');
    
    const desktopSortSelector = desktopSort.locator('#desktop-sort-selector');
    const desktopSortSelectorTexts = await desktopSort.locator('ul#desktop-sort-selector').allInnerTexts();
    const desktopSortTexts = Object.assign([], desktopSortSelectorTexts[0].split('\n'));

    await desktopSortSelector.click();
    await expect(page).toHaveURL(/sort=title/);

    await page.waitForTimeout(5000);
    expect(await srOnlySortDirection.innerText()).toEqual('Change to descending sort');

    desktopSortTexts.forEach((text: string, ix) => {
      expect(text.includes(sortTextList[ix]));
    });
    
    expect(await sortSelectorContainer.count()).toEqual(1);
    expect(await desktopSortSelector.count()).toEqual(1);

    expect(await expect(mobileSort).toHaveClass(/hidden/));
    expect(await expect(desktopSort).toHaveClass(/visible/));

    // sort-bar-filter URL changes
    await page.getByRole('button', { name: 'Relevance' }).click();

    await page.getByText('Weekly views').first().click();
    await expect(page).toHaveURL(/query=cats&sort=-week/);

    await page.getByRole('button', { name: 'Toggle options Weekly views' }).getByRole('button').click();
    await page.getByRole('button', { name: 'All-time views' }).click();
    await expect(page).toHaveURL(/query=cats&sort=-downloads/);

    await page.getByRole('button', { name: 'Title' }).click();
    await expect(page).toHaveURL(/query=cats&sort=title/);

    await page.getByText('Date published').first().click();
    await expect(page).toHaveURL(/query=cats&sort=-date/);

    await page.getByRole('button', { name: 'Toggle options Date published' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Date archived' }).click();
    await expect(page).toHaveURL(/query=cats&sort=-publicdate/);
 
    await page.getByRole('button', { name: 'Toggle options Date archived' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Date reviewed' }).click();
    await expect(page).toHaveURL(/query=cats&sort=-reviewdate/);

    await page.getByRole('button', { name: 'Toggle options Date reviewed' }).getByRole('button').click();
    await page.getByRole('button', { name: 'Date added' }).click();
    await expect(page).toHaveURL(/query=cats&sort=-addeddate/);

    await page.getByRole('button', { name: 'Creator' }).click();
    await expect(page).toHaveURL(/query=cats&sort=creator/);
  });
  
  test('select collection-search-input options', async () => {
    const collectionSearchInput = page.locator('collection-search-input');
    const collectionSearchGo = collectionSearchInput.locator('#go-button');
    const buttonCollapserLocator = collectionSearchInput.locator('#button-collapser');

    expect(await collectionSearchInput.count()).toEqual(1);
    expect(await collectionSearchGo.count()).toEqual(1);

    const searchMetadata = buttonCollapserLocator.getByText('Search metadata');
    const searchTextContents = buttonCollapserLocator.getByText('Search text contents');
    const searchTVCaptions = buttonCollapserLocator.getByText('Search TV news captions');
    const searchRadioTranscripts = buttonCollapserLocator.getByText('Search radio transcripts');
    const searchArchivedWebSites = buttonCollapserLocator.getByText('Search archived web sites');
    
    expect(await searchMetadata.count()).toEqual(1);
    expect(await searchTextContents.count()).toEqual(1);
    expect(await searchTVCaptions.count()).toEqual(1);
    expect(await searchRadioTranscripts.count()).toEqual(1);
    expect(await searchArchivedWebSites.count()).toEqual(1);

    await searchTextContents.click();
    await collectionSearchGo.click();
    await expect(page).toHaveURL(/query=cats&sin=TXT/);

    await searchRadioTranscripts.click();
    await collectionSearchGo.click();
    await expect(page).toHaveURL(/query=cats&sin=RADIO/);
  });

});
