import { type Page, type Locator, expect } from '@playwright/test';

import { CollectionFacets } from '../shared/collection-facets';
import { InfiniteScroller } from '../shared/infiinite-scroller';
import { SortBar } from '../shared/sort-bar';

export enum SearchOption  {
  METADATA = `Search metadata`,
  TEXT = `Search text contents`,
  TV = `Search TV news captions`,
  RADIO = `Search radio transcripts`,
  WEB = `Search archived web sites`,
}

export enum EmptyPlaceHolderText {
  BEGIN = `To begin searching, enter a search term in the box above and hit "Go".`,
  EMPTY = `Your search did not match any items in the Archive. Try different keywords or a more general search.`,
}

export class SearchPage {
  readonly url: string = 'https://archive.org/search';
  readonly page: Page;
  readonly inputSearch: Locator
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearAllFilters: Locator;
  readonly emptyPlaceholder: Locator;
  readonly emptyPlaceholderTitleText: Locator;

  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;
    this.inputSearch = page.getByRole('textbox', {
      name: 'Search the Archive. Filters and Advanced Search available below.'
    });
    this.btnCollectionSearchInputGo = page.locator('collection-search-input #go-button');
    this.btnCollectionSearchInputCollapser = page.locator('collection-search-input #button-collapser');
    this.btnClearAllFilters = page.locator('#facets-header-container .clear-filters-btn');

    this.emptyPlaceholder = page.locator('empty-placeholder');
    this.emptyPlaceholderTitleText = this.emptyPlaceholder.locator('h2.title');

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async checkPagePlaceholder(text: EmptyPlaceHolderText) {
    await (expect(this.emptyPlaceholder).toBeVisible());
    await (expect(this.emptyPlaceholderTitleText).toBeVisible());
    expect(await this.emptyPlaceholderTitleText.textContent()).toContain(text);
  }

  async queryFor(query: string) {
    await this.inputSearch.fill(query);
    await this.inputSearch.press('Enter');
    await this.page.waitForLoadState();
  }

  async displayResultCount() {
    await this.collectionFacets.checkResultCount();
  }

  async displaySearchOptionsView() {
    await this.inputSearch.click();
  }

  async checkFacetGroups() {
    await this.displayResultCount();
    await this.collectionFacets.checkFacetGroups();
  }

  async navigateThruInfiniteScrollerViewModes() {
    await this.infiniteScroller.clickGridView();
    await this.infiniteScroller.clickListView();
    await this.infiniteScroller.clickListCompactView();
  }

  async navigateSortBy(filter: string, direction: string) {
    await this.sortBar.applySortBy(filter, direction);
    await this.displayResultCount();
  }

  async clearAllFilters() {
    await expect(this.btnClearAllFilters).toBeVisible();
    await this.btnClearAllFilters.click();
    await this.sortBar.clearAlphaBarFilter();
    await this.displayResultCount();
    await expect(this.btnClearAllFilters).not.toBeVisible();
  }

  async checkSearchInputOptions() {
    await expect(this.inputSearch).toBeVisible();
    await expect(this.btnCollectionSearchInputGo).toBeVisible();

    await this.inputSearch.click();
    await expect(this.btnCollectionSearchInputCollapser).toBeVisible();
    
    const btnOptionsCount = await this.btnCollectionSearchInputCollapser.locator('ul > li').count();

    expect(btnOptionsCount).toBe(5);
    
    const options = this.btnCollectionSearchInputCollapser.locator('ul > li > label > span');
    await expect(options).toHaveText([
      `Search metadata`,
      `Search text contents`,
      `Search TV news captions`,
      `Search radio transcripts`,
      `Search archived web sites`,
    ]);
  }

  async clickSearchInputOption(option: SearchOption) {
    await expect(this.btnCollectionSearchInputCollapser.getByText(option)).toBeVisible();
    await this.btnCollectionSearchInputCollapser.getByText(option).click();
  }

  async checkTVPage() {
    await this.page.waitForTimeout(3000);
    await expect(this.page.getByRole('link', { name: 'TV News Archive', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Search' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Try the new Search Beta!' })).toBeVisible();
    expect(await this.page.title()).toContain('Internet Archive TV NEWS');
    // go back to search beta page
    await this.page.getByRole('link', { name: 'Try the new Search Beta!' }).click();
  }

  async checkRadioPage() {
    await this.page.waitForTimeout(3000);
    await expect(this.page.getByRole('link', { name: 'Try the new Search Beta!' })).toBeVisible();
    // go back to start search page
    await this.visit();
    await this.displaySearchOptionsView();
  }

  async checkWaybackPage() {
    await this.page.waitForTimeout(3000);
    expect(await this.page.title()).toContain('Wayback Machine');
    // go back to start search page
    await this.visit();
  }
  
}
