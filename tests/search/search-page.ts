import { type Page, type Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly url: string = 'https://archive.org/search';
  readonly searchInput: Locator;
  readonly infiniteScroller: Locator;
  readonly sortFilterBar: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', {
      name: 'Search the Archive. Filters and Advanced Search available below.'
    });
    this.infiniteScroller = page.locator('infinite-scroller');
    this.sortFilterBar = page.locator('sort-filter-bar section#sort-bar');
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
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
  
}
