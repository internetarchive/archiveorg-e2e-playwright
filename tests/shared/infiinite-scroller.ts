import { type Page, type Locator, expect } from '@playwright/test';

import { SortBar } from './sort-bar';

export class InfiniteScroller {
  
  readonly page: Page;
  readonly infiniteScroller: Locator;
  readonly displayStyleSelector: Locator;
  readonly displayStyleSelectorOptions: Locator;

  readonly infiniteScrollerContainer: Locator;
  readonly itemTile: Locator;
  readonly itemTileStats: Locator;
  readonly itemTileViewCountText: Locator;

  readonly selectorIdTitleName: string;

  readonly sortBar: SortBar;

  currentViewMode: string;

  public constructor(page: Page) {
    this.page = page;
    this.sortBar = new SortBar(page);

    this.infiniteScroller = page.locator('infinite-scroller');
    this.infiniteScrollerContainer = this.infiniteScroller.locator('#container');

    const sortBarSection = this.sortBar.sortFilterBar;
    this.displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    this.displayStyleSelectorOptions = this.displayStyleSelector.locator('ul > li');

    const tileDispatcher = this.infiniteScroller.locator('tile-dispatcher');
    // refactor this
    this.itemTileViewCountText = tileDispatcher.locator('#stats-row > li:nth-child(2) > p > span');

    this.currentViewMode = 'grid';
  }

  async isViewModesVisible () {
    await expect(this.displayStyleSelector).toBeVisible();
  }

  async clickTileView() {
    await this.displayStyleSelectorOptions.nth(0).click();
    expect(await expect(this.infiniteScroller).toHaveClass(/grid/));
    await expect(this.infiniteScroller.locator('item-tile').first()).toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();

    this.currentViewMode = 'grid';
  }

  async clickListView() {
    await this.displayStyleSelectorOptions.nth(1).click();
    await expect(this.infiniteScroller).toHaveClass(/list-detail/);
    await expect(this.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();

    this.currentViewMode = 'list';
  }

  async clickListCompactView() {
    await this.displayStyleSelectorOptions.nth(2).click();
    await expect(this.infiniteScroller).toHaveClass(/list-compact/);
    await expect(this.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
    await expect(this.infiniteScroller.locator('tile-list-compact').first()).toBeVisible();

    this.currentViewMode = 'compact';
  }

  async getSections () {
    await this.hoverToFirstItemAndCheckItemTitle();
    await this.clickFirstResultAndRedirectToDetailsPage();
  }

  async hoverToFirstItemAndCheckItemTitle () {
    const resultsContainer = await this.infiniteScrollerContainer.all();
    expect(resultsContainer.length).toBeGreaterThan(1);

    // The 1st child from resultsContainer is #sentinel, so get the 2nd child from it instead
    const firstResultItem = resultsContainer[1];
    await firstResultItem.hover();
    await this.page.waitForSelector('tile-hover-pane');
    await expect(this.page.locator('tile-hover-pane')).toBeVisible();

    // Check if tile-hover-pane "title" is similar to the current item "title"
    const firstResultItemText = await firstResultItem.locator('#title').first().textContent();
    const tileHoverPaneTitleText = await this.page.locator('tile-hover-pane #title > a').textContent();
    // TODO: toContain has issues - need to fix
    expect(tileHoverPaneTitleText).toContain(firstResultItemText);
  }

  async clickFirstResultAndRedirectToDetailsPage() {
    await this.page.waitForLoadState();

    const resultsContainer = await this.infiniteScrollerContainer.all();
    expect(resultsContainer.length).toBeGreaterThan(1);

    // The 1st child from resultsContainer is #sentinel, so get the 2nd child from it instead
    const firstResultItem = resultsContainer[1];
    const firstResultItemLink = await firstResultItem.locator('a').first().getAttribute('href');
    const pattern = new RegExp(`${firstResultItemLink}`);
    await firstResultItem.click();
    await this.page.waitForTimeout(5000);
    await expect(this.page).toHaveURL(pattern);
    expect(await this.page.title()).toContain('Free Download, Borrow, and Streaming : Internet Archive');
  }

  async checkAllTimeViewsFromTileViewMode() {
    const resultsContainer = await this.infiniteScrollerContainer.all();
    expect(resultsContainer.length).toBeGreaterThan(1);

    await this.page.waitForTimeout(3000);
    /**
     * Note: (tile view mode)
     * - "cats" => All-time views
     * - The first 2 tile items displays collection-tile 
     * - Code need to check if it's a collection-tile or item-tile
     */
    for (const { index, result } of resultsContainer.map((result, index) => ({ index, result }))) {
      // The 1st child from resultsContainer is #sentinel, so get the 2nd child from it instead
      if (index === 0) {
        console.log('do nothing - sentinel');
      } else {
        console.log('get current view mode: ', this.currentViewMode);
        // check if collection-tile or item-tile
        const collectionTileSelector = 'a > collection-tile';
        const itemTileSelector = 'a > item-tile';
        const collectionTileCount = await result.locator(collectionTileSelector).count();
        const itemTileCount = await result.locator(itemTileSelector).count();

        console.log('index: ', index, 'collectionTileCount: ', collectionTileCount, ' itemTileCount: ', itemTileCount);
        if (collectionTileCount === 1 && itemTileCount === 0) {
          console.log('it is a collection tile');
        } else if (collectionTileCount === 0 && itemTileCount === 1) {
          console.log('it is a item tile');
          const viewsStatsSelector = 'tile-stats #stats-row > li:nth-child(2)';
          await expect(result.locator(viewsStatsSelector)).toBeVisible();
        } else {
          console.log('it is something else');
          // console.log('innerHtml(): ', await result.innerHTML());
        }
      }
    }
  }

  async checkDatePublishedViewsFromListViewMode() {
    const resultsContainer = await this.infiniteScrollerContainer.all();
    expect(resultsContainer.length).toBeGreaterThan(1);

    await this.page.waitForTimeout(3000);

    for (const { index, result } of resultsContainer.map((result, index) => ({ index, result }))) {
      // The 1st child from resultsContainer is #sentinel, so get the 2nd child from it instead
      if (index === 0) {
        console.log('do nothing - sentinel');
      } else {
        console.log('get current view mode: ', this.currentViewMode);
        const publishedSelector = '';
        await expect(this.page.locator('tile-list #list-line #dates-line > div > span')).toBeVisible();
      }
      if (index === 6) break;
    }
  }

}
