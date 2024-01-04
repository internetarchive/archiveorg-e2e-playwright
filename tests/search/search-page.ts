import { type Page, type Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly url: string = 'https://archive.org/search';
  readonly inputSearch: Locator;
  readonly facetsContainer: Locator;
  readonly infiniteScroller: Locator;
  readonly sortFilterBar: Locator;
  readonly collectionSearchInput: Locator
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearAllFilters: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.inputSearch = page.getByRole('textbox', {
      name: 'Search the Archive. Filters and Advanced Search available below.'
    });
    this.facetsContainer = page.locator('div#facets-container');
    this.infiniteScroller = page.locator('infinite-scroller');
    this.sortFilterBar = page.locator('sort-filter-bar section#sort-bar');
    this.collectionSearchInput = page.locator('collection-search-input');
    this.btnCollectionSearchInputGo = page.locator('collection-search-input #go-button');
    this.btnCollectionSearchInputCollapser = page.locator('collection-search-input #button-collapser');
    this.btnClearAllFilters = page.locator('#facets-header-container .clear-filters-btn');
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async search(query: string) {
    await this.inputSearch.fill(query);
    await this.inputSearch.press('Enter');
  }

  async loadingResultCount() {
    await expect(this.page.getByText('Searching')).toBeVisible();
    await this.page.waitForTimeout(5000);
    await expect(this.page.getByText('Results')).toBeVisible();
  }

  async navigateThruInfiniteScrollerViewModes () {
    const sortBarSection = this.sortFilterBar;
    const displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    const displayStyleSelectorOptions = displayStyleSelector.locator('ul > li');
  
    // check if default view mode is grid
    expect(await expect(this.infiniteScroller).toHaveClass(/grid/));
    await expect(this.infiniteScroller.locator('item-tile').first()).toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();
  
    // switch to list-detail view mode
    await displayStyleSelectorOptions.nth(1).click();
    await expect(this.infiniteScroller).toHaveClass(/list-detail/);
    await expect(this.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();
  
    // switch to list-compact view mode
    await displayStyleSelectorOptions.nth(2).click();
    await expect(this.infiniteScroller).toHaveClass(/list-compact/);
    await expect(this.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).toBeVisible();
  }

  async clearAllFilters () {
    await expect(this.btnClearAllFilters).toBeVisible();
    await this.btnClearAllFilters.click();
    await this.loadingResultCount();
    await expect(this.btnClearAllFilters).not.toBeVisible();
  }
  
}
