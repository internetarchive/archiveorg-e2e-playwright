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
};

const PAGE_TIMEOUT = 3000;

export class SearchPage {
  readonly url: string = 'https://archive.org/search';
  readonly page: Page;
  readonly inputSearch: Locator
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearAllFilters: Locator;
  readonly emptyPlaceholder: Locator;
  readonly emptyPlaceholderTitleText: Locator;
  readonly waybackInputSearch: Locator;

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

    this.waybackInputSearch = page.locator('input.rbt-input-main.form-control.rbt-input');

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async checkEmptyPagePlaceholder() {
    await (expect(this.emptyPlaceholder).toBeVisible());
    await (expect(this.emptyPlaceholderTitleText).toBeVisible());
  }

  async queryFor(query: string) {
    await this.inputSearch.fill(query);
    await this.inputSearch.press('Enter');
    await this.page.waitForLoadState();
  }

  async displayResultCount() {
    await this.collectionFacets.checkResultCount();
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
    await this.inputSearch.click();
    await expect(this.btnCollectionSearchInputCollapser.getByText(option)).toBeVisible();
    await this.btnCollectionSearchInputCollapser.getByText(option).click();
  }

  async checkTVPage(query: string) {
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    expect(await this.page.title()).toContain('Internet Archive TV NEWS');
    await expect(this.page.getByRole('link', { name: 'TV News Archive', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Search' })).toBeVisible();
    await expect(this.inputSearch).toBeVisible();
    expect(await this.inputSearch.inputValue()).toContain(query);
  }

  async checkRadioPage(query: string) {
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    await expect(this.inputSearch).toBeVisible();
    expect(await this.inputSearch.inputValue()).toContain(query);
  }

  async checkWaybackPage(query: string) {
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    expect(await this.page.title()).toContain('Wayback Machine');
    await expect(this.waybackInputSearch).toBeVisible();
    expect(await this.waybackInputSearch.inputValue()).toContain(query);
  }

  async checkInputSearchContents(inputSearch: Locator) {

  }

  async goBackToSearchPage() {
    await this.visit();
  }
  
}
