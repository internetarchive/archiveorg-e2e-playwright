import { type Page, type Locator, expect } from '@playwright/test';

import { SortBar } from './sort-bar';

export type LayoutViewMode = 'tile' | 'list' | 'compact';

export class InfiniteScroller {
  
  readonly page: Page;
  readonly infiniteScroller: Locator;
  readonly infiniteScrollerSectionContainer: Locator;
  readonly displayStyleSelector: Locator;
  readonly displayStyleSelectorOptions: Locator;
  readonly firstItemTile: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.infiniteScroller = page.locator('infinite-scroller');
    this.infiniteScrollerSectionContainer = this.infiniteScroller.locator('#container');

    const sortBar = new SortBar(page);
    const sortBarSection = sortBar.sortFilterBar;
    this.displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    this.displayStyleSelectorOptions = this.displayStyleSelector.locator('ul > li');
    this.firstItemTile = this.infiniteScrollerSectionContainer.locator('article').nth(0);
  }

  async clickViewMode (viewMode: LayoutViewMode) {
    switch (viewMode) {
      case 'tile':
        await this.displayStyleSelectorOptions.locator('#grid-button').click();
        return;
      case 'list':
        await this.displayStyleSelectorOptions.locator('#list-detail-button').click();
        return;
      case 'compact':
        await this.displayStyleSelectorOptions.locator('#list-compact-button').click();
        return;
      default: return;
    }
  }

  async assertLayoutViewModeChange (viewMode: LayoutViewMode) {
    switch (viewMode) {
      case 'tile':
        await expect(this.displayStyleSelector.locator('#grid-button')).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/grid/));
        return;
      case 'list':
        await expect(this.displayStyleSelector.locator('#list-detail-button')).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/list-detail/));
        return;
      case 'compact':
        await expect(this.displayStyleSelector.locator('#list-compact-button')).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/list-compact/));
        return;
      default: return;
    }
  }

  async hoverToFirstItem () {
    await this.page.waitForLoadState('networkidle');
    expect(await this.firstItemTile.count()).toBe(1);

    await this.firstItemTile.hover();
    await expect(this.firstItemTile.locator('tile-hover-pane')).toBeVisible();
  }

  async assertTileHoverPaneTitleIsSameWithItemTile() {
    const textFirstItemTile = await this.firstItemTile.locator('#title > h4').first().innerText();
    const textTileHoverPane = await this.firstItemTile.locator('tile-hover-pane #title > a').innerText();
    expect(textFirstItemTile).toEqual(textTileHoverPane);
  }

  async clickFirstResultAndCheckRedirectToDetailsPage () {
    await this.page.waitForLoadState('networkidle');
    expect(await this.firstItemTile.count()).toBe(1);

    // Get item tile link to compare with the redirect URL
    const itemLink = await this.firstItemTile.locator('a').first().getAttribute('href');
    const pattern = new RegExp(`${itemLink}`);
    await this.firstItemTile.click();

    await this.page.waitForLoadState();
    await expect(this.page).toHaveURL(pattern);
  }

  


  // TO REFACTOR
  // async checkAllTimeViewsFromTileViewMode() {
  //   // get all article elements
  //   const articlesContainer = await this.infiniteScrollerSectionContainer.locator('article').all();
  //   expect(articlesContainer.length).toBeGreaterThan(1);

  //   await this.page.waitForTimeout(5000);
  //   // Note: (tile view mode) - Need to check if it's a collection-tile or item-tile
  //   for (const { index, article } of articlesContainer) {
  //     if (index === 10) break; // check the first 10 items for now

  //     // check if collection-tile or item-tile
  //     const collectionTileCount = await article.locator('a > collection-tile').count();
  //     const itemTileCount = await article.locator('a > item-tile').count();
  //     console.log('index: ', index, 'collectionTileCount: ', collectionTileCount, ' itemTileCount: ', itemTileCount);

  //     if (collectionTileCount === 1 && itemTileCount === 0) {
  //       console.log('it is a collection tile - do nothing for now');
  //     } else if (collectionTileCount === 0 && itemTileCount === 1) {
  //       console.log('it is a item tile');
  //       await expect(article.locator('tile-stats #stats-row > li:nth-child(2)')).toBeVisible();

  //       const getTitle = await article.locator('tile-stats #stats-row > li:nth-child(2)').getAttribute('title');
  //       console.log('title: ', getTitle);
  //       // check if title contains all time views
  //     } else {
  //       console.log('it is not a collection-tile nor an item-tile');
  //     }
  //   }
  // }

  // async checkDatePublishedViewsFromListViewMode() {
  //   // get all article elements
  //   const articlesContainer = await this.infiniteScrollerSectionContainer.locator('article').all();
  //   expect(articlesContainer.length).toBeGreaterThan(1);

  //   const dateLineLabelSelector = '#list-line #dates-line > div > span';
  //   await this.page.waitForTimeout(5000);

  //   for (const { index, result } of articlesContainer.map((result, index) => ({ index, result }))) {
  //     if (index === 10) break; // check the first 10 items for now
  //     expect(await result.locator(dateLineLabelSelector).innerText()).toContain('Published');
  //   }
  // }

}
