import { type Page, type Locator, expect } from '@playwright/test';

import { SortBar } from './sort-bar';

export class InfiniteScroller {
  
  readonly page: Page;
  readonly infiniteScroller: Locator;
  readonly displayStyleSelector: Locator;
  readonly displayStyleSelectorOptions: Locator;

  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;
    this.sortBar = new SortBar(page);

    this.infiniteScroller = page.locator('infinite-scroller');

    const sortBarSection = this.sortBar.sortFilterBar;
    this.displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    this.displayStyleSelectorOptions = this.displayStyleSelector.locator('ul > li');
  }

  async isViewModesVisible () {
    // return await this.displayStyleSelector.isVisible();
    await expect(this.displayStyleSelector).toBeVisible();
  }

  async clickGridView() {
    await this.displayStyleSelectorOptions.nth(0).click();
    expect(await expect(this.infiniteScroller).toHaveClass(/grid/));
    await expect(this.infiniteScroller.locator('item-tile').first()).toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();
  }

  async clickListView() {
    await this.displayStyleSelectorOptions.nth(1).click();
    await expect(this.infiniteScroller).toHaveClass(/list-detail/);
    await expect(this.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();
  }

  async clickListCompactView() {
    await this.displayStyleSelectorOptions.nth(2).click();
    await expect(this.infiniteScroller).toHaveClass(/list-compact/);
    await expect(this.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).toBeVisible();
  }

}
