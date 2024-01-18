import { type Page, type Locator, expect } from '@playwright/test';

import { SortBar } from './sort-bar';

import { clearStringWhitespaces } from './utils';

export type LayoutViewMode = 'tile' | 'list' | 'compact';

export class InfiniteScroller {
  
  readonly page: Page;
  readonly infiniteScroller: Locator;
  readonly infiniteScrollerSectionContainer: Locator;
  readonly displayStyleSelector: Locator;
  readonly displayStyleSelectorOptions: Locator;

  // readonly itemTile: Locator;
  // readonly itemTileStats: Locator;
  // readonly itemTileViewCountText: Locator;

  // readonly selectorIdTitleName: string;

  readonly sortBar: SortBar;
  
  public constructor(page: Page) {
    this.page = page;
    this.sortBar = new SortBar(page);

    this.infiniteScroller = page.locator('infinite-scroller');
    this.infiniteScrollerSectionContainer = this.infiniteScroller.locator('#container');

    const sortBarSection = this.sortBar.sortFilterBar;
    this.displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    this.displayStyleSelectorOptions = this.displayStyleSelector.locator('ul > li');

    // const tileDispatcher = this.infiniteScroller.locator('tile-dispatcher');
    // to refactor this
    // this.itemTileViewCountText = tileDispatcher.locator('#stats-row > li:nth-child(2) > p > span');
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

  async hoverToFirstItemAndCheckItemTitle () {
    await this.page.waitForLoadState();


    const articlesContainer = await this.infiniteScrollerSectionContainer.locator('article').all();
    // const firstItemTile = this.infiniteScrollerSectionContainer.locator('article').nth(0);
    // expect(await firstItemTile.count()).toBe(1);
    await articlesContainer[0].hover();
    // TO FIX: error in webkit ->  this.page.waitForSelector('tile-hover-pane') -> Error: page.waitForSelector: Target closed
    // await this.page.waitForSelector('tile-hover-pane');
    await expect(articlesContainer[0].locator('tile-hover-pane')).toBeVisible();
    
    const textFirstItemTile = await articlesContainer[0].locator('#title > h4').first().innerText();
    const textTileHoverPane = await this.page.locator('tile-hover-pane #title > a').innerText();
    expect(textFirstItemTile).toEqual(textTileHoverPane);
  }

  // async hoverToFirstItemAndCheckItemTitle () {
  //   await this.page.waitForLoadState();
  //   // get all article elements
  //   const articlesContainer = await this.infiniteScrollerSectionContainer.locator('article').all();
  //   expect(articlesContainer.length).toBeGreaterThan(1);

  //   const firstResultItem = articlesContainer[0];
  //   await firstResultItem.hover();
  //   await this.page.waitForSelector('tile-hover-pane');
  //   await expect(firstResultItem.locator('tile-hover-pane')).toBeVisible();

  //   // still need to improve code
  //   const firstResultItemText = await firstResultItem.locator('#title > h4').first().textContent();
  //   const tileHoverPaneTitleText = await this.page.locator('tile-hover-pane #title > a').textContent();
  //   console.log('tileHoverTitleText: ', tileHoverPaneTitleText, ' firstResultItemText: ', firstResultItemText);

  //   if (firstResultItemText && tileHoverPaneTitleText) {
  //     expect(clearStringWhitespaces(tileHoverPaneTitleText!)).toContain(clearStringWhitespaces(firstResultItemText!));
  //   } else {
  //     console.log('something went wrong');
  //   }
  // }

  // TO TEST
  // async clickFirstResultAndRedirectToDetailsPage() {
  //   await this.page.waitForLoadState();

  //   // get all article elements
  //   const articlesContainer = await this.infiniteScrollerSectionContainer.locator('article').all();
  //   expect(articlesContainer.length).toBeGreaterThan(10);
  
  //   const firstResultItem = articlesContainer[0];
  //   const firstResultItemLink = await firstResultItem.locator('a').first().getAttribute('href');
  //   const pattern = new RegExp(`${firstResultItemLink}`);
  //   await firstResultItem.click();
  //   await this.page.waitForLoadState();
  //   await expect(this.page).toHaveURL(pattern);

  //   expect(await this.page.title()).toContain('Free Download, Borrow, and Streaming : Internet Archive');
  // }

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
