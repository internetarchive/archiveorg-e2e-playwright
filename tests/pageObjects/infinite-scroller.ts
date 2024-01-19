import { type Page, type Locator, expect } from '@playwright/test';

import { SortBar, SortOrder, SortFilter } from './sort-bar';

export type LayoutViewMode = 'tile' | 'list' | 'compact';

export class InfiniteScroller {

  readonly COUNT_ITEMS: Number = 10;

  readonly page: Page;
  readonly infiniteScroller: Locator;
  readonly infiniteScrollerSectionContainer: Locator;
  readonly displayStyleSelector: Locator;
  readonly displayStyleSelectorOptions: Locator;
  readonly firstItemTile: Locator;

  readonly sortBar: SortBar;

  viewMode: LayoutViewMode;

  public constructor(page: Page) {
    this.page = page;

    this.infiniteScroller = page.locator('infinite-scroller');
    this.infiniteScrollerSectionContainer = this.infiniteScroller.locator('#container');

    this.sortBar = new SortBar(page);
    const sortBarSection = this.sortBar.sortFilterBar;
    this.displayStyleSelector = sortBarSection.locator('div#display-style-selector');
    this.displayStyleSelectorOptions = this.displayStyleSelector.locator('ul > li');
    this.firstItemTile = this.infiniteScrollerSectionContainer.locator('article').nth(0);

    this.viewMode = 'tile';
  }

  async clickViewMode (viewMode: LayoutViewMode) {
    switch (viewMode) {
      case 'tile':
        this.viewMode = 'tile';
        await this.displayStyleSelectorOptions.locator('#grid-button').click();
        return;
      case 'list':
        this.viewMode = 'list';
        await this.displayStyleSelectorOptions.locator('#list-detail-button').click();
        return;
      case 'compact':
        this.viewMode = 'compact';
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

  async checkItems (filter: SortFilter, order: SortOrder) {
    // TODO: per sort filter and sort order + view mode

    // This test is only applicable in tile view mode
    if (filter === 'Weekly views' || filter === 'All-time views') {
      await this.page.waitForLoadState('domcontentloaded');
      const tileStatsViews = await this.getTileStatsViewTitles();

      const isAllViews = tileStatsViews.every(stat => stat.includes(filter.toLowerCase()));
      const arrViewCount: Number[] = tileStatsViews.map(stat => Number(stat.split(' ')[0]));
      const isSortedCorrectly = order === 'descending' 
        ? this.sortBar.isViewsSortedDescending(arrViewCount) 
        : this.sortBar.isViewsSortedAscending(arrViewCount);

      expect(isAllViews).toBeTruthy();
      expect(isSortedCorrectly).toBeTruthy();
    }

    // This test is only applicable in list view mode for "Date" filters
    if (filter === 'Date published' || filter === 'Date archived' || filter === 'Date added' || filter === 'Date reviewed') {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(3000);
      
      const listDateLabels = await this.getDatesLine();
      // Parse date sort filter to check list of date labels from page item results
      const checkFilterText = filter.split('Date ')[1].replace(/^./, str => str.toUpperCase());
      console.log('listDateLabels: ', listDateLabels);

      const isDateFilter = listDateLabels.every(date => date.includes(checkFilterText));

      expect(isDateFilter).toBeTruthy();
    }
  }

  async getTileStatsViewTitles () {
    const arrTileStatsTitle: string[] = [];
    const allItems = await this.infiniteScrollerSectionContainer.locator('article').all();

    // Load first 10 items and get tile stats views title
    let index = 0;
    while (index !== this.COUNT_ITEMS) {
      const collectionTileCount = await allItems[index].locator('a > collection-tile').count();
      const itemTileCount = await allItems[index].locator('a > item-tile').count();
      console.log('index: ', index, 'collectionTileCount: ', collectionTileCount, ' itemTileCount: ', itemTileCount);

      if (collectionTileCount === 1 && itemTileCount === 0) {
        console.log('it is a collection tile - do nothing for now');
      } else if (collectionTileCount === 0 && itemTileCount === 1) {
        const tileStatsTitle = await allItems[index].locator('#stats-row > li:nth-child(2)').getAttribute('title');
        if (tileStatsTitle)
          arrTileStatsTitle.push(tileStatsTitle);
      } else {
        console.log('it is not a collection-tile nor an item-tile');
      }

      index++;
    }

    return arrTileStatsTitle;
  }

  async getDatesLine () {
    const arrDateLine: string[] = [];
    let dateSpanLabel = '';
    const allItems = await this.infiniteScrollerSectionContainer.locator('article').all();

    // Load first 10 items and get tile stats views title
    let index = 0;
    while (index !== this.COUNT_ITEMS) {
      // There can be 2 date metadata in a row if filter is either Date archived, Date reviewed, or Date added
      // eg. Published: Nov 15, 2023 - Archived: Jan 19, 2024
      const dateLineMetadataCount = await allItems[index].locator('#dates-line > div.metadata').count();
      if (dateLineMetadataCount === 1) {
        dateSpanLabel = await allItems[index].locator('#dates-line > div.metadata').first().innerText();
      } else {
        dateSpanLabel = await allItems[index].locator('#dates-line > div.metadata').nth(1).innerText();
      }

      if (dateSpanLabel) arrDateLine.push(dateSpanLabel);

      index++;
    }

    return arrDateLine;
  }

}
