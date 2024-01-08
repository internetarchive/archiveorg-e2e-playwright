import { type Page, type Locator, expect } from '@playwright/test';

import { CollectionFacets } from '../shared/collection-facets';
import { InfiniteScroller } from '../shared/infiinite-scroller';
import { SortBar } from '../shared/sort-bar';

export class SearchPage {
  readonly url: string = 'https://archive.org/search';
  readonly page: Page;
  readonly inputSearch: Locator;
  readonly collectionSearchInput: Locator
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearAllFilters: Locator;

  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;
    this.inputSearch = page.getByRole('textbox', {
      name: 'Search the Archive. Filters and Advanced Search available below.'
    });
    this.collectionSearchInput = page.locator('collection-search-input');
    this.btnCollectionSearchInputGo = page.locator('collection-search-input #go-button');
    this.btnCollectionSearchInputCollapser = page.locator('collection-search-input #button-collapser');
    this.btnClearAllFilters = page.locator('#facets-header-container .clear-filters-btn');

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async search(query: string) {
    await this.inputSearch.fill(query);
    await this.inputSearch.press('Enter');
    await this.page.waitForLoadState();
  }

  async displayResultCount () {
    await this.collectionFacets.checkResultCount();
  }

  async checkFacetGroups() {
    await this.displayResultCount();
    await this.collectionFacets.checkFacetGroups();
  }

  async navigateThruInfiniteScrollerViewModes () {
    await this.infiniteScroller.clickGridView();
    await this.infiniteScroller.clickListView();
    await this.infiniteScroller.clickListCompactView();
  }

  async navigateSortBy (filter: string, direction: string) {
    await this.sortBar.applySortBy(filter, direction);
    await this.displayResultCount();
  }

  async clearAllFilters () {
    await expect(this.btnClearAllFilters).toBeVisible();
    await this.btnClearAllFilters.click();
    await this.sortBar.clearAlphaBarFilter();
    await this.displayResultCount();
    await expect(this.btnClearAllFilters).not.toBeVisible();
  }

  async checkSearchInputOptions () {
    await expect(this.collectionSearchInput).toBeVisible();
    await expect(this.btnCollectionSearchInputGo).toBeVisible();
    await expect(this.btnCollectionSearchInputCollapser).toBeVisible();

    const options = this.btnCollectionSearchInputCollapser.locator('ul > li > label > span');
    await expect(options).toHaveText([
      `Search metadata`,
      `Search text contents`,
      `Search TV news captions`,
      `Search radio transcripts`,
      `Search archived web sites`,
    ]);
  }
  
}
