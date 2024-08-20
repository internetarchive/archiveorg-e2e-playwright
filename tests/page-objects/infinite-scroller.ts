import { type Page, type Locator, expect } from '@playwright/test';

import { SortBar } from './sort-bar';

import {
  DateMetadataLabel,
  LayoutViewMode,
  SortOrder,
  SortFilter,
  ViewFacetMetadata,
  LayoutViewModeLocator,
} from '../models';

import { datesSorted, viewsSorted } from '../utils';

export class InfiniteScroller {
  readonly page: Page;
  readonly infiniteScroller: Locator;
  readonly infiniteScrollerSectionContainer: Locator;
  readonly displayStyleSelector: Locator;
  readonly displayStyleSelectorOptions: Locator;
  readonly firstItemTile: Locator;

  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.infiniteScroller = page.locator('infinite-scroller');
    this.infiniteScrollerSectionContainer =
      this.infiniteScroller.locator('#container');

    this.sortBar = new SortBar(page);
    const sortBarSection = this.sortBar.sortFilterBar;
    this.displayStyleSelector = sortBarSection.locator(
      'div#display-style-selector',
    );
    this.displayStyleSelectorOptions =
      this.displayStyleSelector.locator('ul > li');
    this.firstItemTile = this.infiniteScrollerSectionContainer
      .locator('article')
      .first();
  }

  async clickViewMode(viewModeLocator: LayoutViewModeLocator) {
    await this.displayStyleSelectorOptions.locator(viewModeLocator).click();
  }

  async assertLayoutViewModeChange(viewMode: LayoutViewMode) {
    switch (viewMode) {
      case 'tile':
        await expect(
          this.displayStyleSelector.getByTestId('grid-button'),
        ).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/grid/));
        return;
      case 'list':
        await expect(
          this.displayStyleSelector.getByTestId('list-detail-button'),
        ).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/list-detail/));
        return;
      case 'compact':
        await expect(
          this.displayStyleSelector.getByTestId('list-compact-button'),
        ).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/list-compact/));
        return;
      default:
        return;
    }
  }

  async hoverToFirstItem() {
    expect(await this.firstItemTile.count()).toBe(1);

    await this.firstItemTile.hover();
    await expect(this.firstItemTile.locator('tile-hover-pane')).toBeVisible({
      timeout: 60000,
    });
  }

  async assertTileHoverPaneTitleIsSameWithItemTile() {
    const textFirstItemTile = await this.firstItemTile
      .locator('#title > h4')
      .first()
      .innerText();
    const textTileHoverPane = await this.firstItemTile
      .locator('tile-hover-pane #title > a')
      .innerText();
    expect(textFirstItemTile).toEqual(textTileHoverPane);
  }

  async clickFirstResultAndCheckRedirectToDetailsPage() {
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    expect(await this.firstItemTile.count()).toBe(1);

    // Get item tile link to compare with the redirect URL
    const itemLink = await this.firstItemTile
      .locator('a')
      .first()
      .getAttribute('href');
    const pattern = new RegExp(`${itemLink}`);
    await this.firstItemTile.click();

    await this.page.waitForLoadState('load', { timeout: 60000 });
    await expect(this.page).toHaveURL(pattern);
  }

  // TODO: per sort filter and sort order + view mode???
  async validateSortingResults(
    filter: SortFilter,
    order: SortOrder,
    displayItemCount: Number,
  ) {
    // This test is only applicable in tile view mode for "views" filters
    if (filter === 'Weekly views' || filter === 'All-time views') {
      const tileStatsViews = await this.getTileStatsViewCountTitles(
        displayItemCount,
      );

      const isAllViews = tileStatsViews.every(stat =>
        stat.includes(filter.toLowerCase()),
      );
      const arrViewCount: Number[] = tileStatsViews.map(stat =>
        Number(stat.split(' ')[0]),
      );
      const isSortedCorrectly = viewsSorted(order, arrViewCount);

      expect(isAllViews).toBeTruthy();
      expect(isSortedCorrectly).toBeTruthy();
    }

    // This test is only applicable in list view mode for "Date" filters
    if (
      filter === 'Date published' ||
      filter === 'Date archived' ||
      filter === 'Date added' ||
      filter === 'Date reviewed'
    ) {
      const dateMetadataLabels = await this.getDateMetadataLabels(
        displayItemCount,
      );
      // Parse date sort filter to check list of date labels from page item results
      // => Published, Archived, Added, Reviewed
      const checkFilterText = filter
        .split('Date ')[1]
        .replace(/^./, str => str.toUpperCase());
      const isDateFilter = dateMetadataLabels.every(
        date => date.filter === checkFilterText,
      );
      const isSortedCorrectly = datesSorted(order, dateMetadataLabels);

      expect(isDateFilter).toBeTruthy();
      expect(isSortedCorrectly).toBeTruthy();
    }
  }

  async validateIncludedFacetedResults(
    viewFacetMetadata: ViewFacetMetadata,
    facetLabels: string[],
    toInclude: boolean,
    displayItemCount: Number,
  ) {
    const facetedResults = await this.getFacetedResultsByViewFacetGroup(
      viewFacetMetadata,
      displayItemCount,
    );
    if (facetedResults) {
      const isAllFacettedCorrectly = facetLabels.some(label => {
        return toInclude
          ? facetedResults.includes(label)
          : !facetedResults.includes(label);
      });
      expect(isAllFacettedCorrectly).toBeTruthy();
    }
  }

  async displaysFirstResult() {
    await expect(this.firstItemTile).toBeVisible({ timeout: 60000 });
  }

  // Getters
  async getTileStatsViewCountTitles(
    displayItemCount: Number,
  ): Promise<string[]> {
    const arrTileStatsTitle: string[] = [];
    const allItems = await this.getAllInfiniteScrollerArticleItems();

    let index = 0;
    while (index !== displayItemCount) {
      await allItems[index].locator('tile-dispatcher').waitFor({ state: 'visible' });
      const itemTileCount = await allItems[index]
        .locator('a > item-tile')
        .count();

      if (itemTileCount === 1) {
        // Get view count from tile-stats row
        const tileStatsTitle = await allItems[index]
          .locator('#stats-row > li:nth-child(2)')
          .getAttribute('title');
        if (tileStatsTitle) arrTileStatsTitle.push(tileStatsTitle);
      }

      index++;
    }

    return arrTileStatsTitle;
  }

  async getDateMetadataLabels(
    displayItemCount: Number,
  ): Promise<DateMetadataLabel[]> {
    const arrDateLine: DateMetadataLabel[] = [];
    const allItems = await this.getAllInfiniteScrollerArticleItems();

    let index = 0;
    while (index !== displayItemCount) {
      // Load items and get tileStats views based on displayItemCount
      // There can be 2 date metadata in a row if filter is either Date archived, Date reviewed, or Date added
      // eg. Published: Nov 15, 2023 - Archived: Jan 19, 2024
      // We always want the last one since it will correspond to the current "sort by" field
      const dateSpanLabel = await allItems[index]
        .locator('#dates-line > div.metadata')
        .last()
        .innerText();

      if (dateSpanLabel) {
        // Need to split date filter and date format value: Published: 2150 or Published: Nov 15, 2023
        // Ideal format: { filter: 'Published', date: '2150' }
        const strSplitColonSpace = dateSpanLabel.split(': ');
        const objDateLine = {
          filter: strSplitColonSpace[0],
          date: strSplitColonSpace[1],
        };
        arrDateLine.push(objDateLine);
      }

      index++;
    }
    return arrDateLine;
  }

  async getItemTileIconTitle(item: Locator, arrItem: string[]) {
    const tileIconTitle = await this.getTileIconTitleAttr(item);
    if (tileIconTitle) arrItem.push(tileIconTitle);
  }

  async getCollectionItemTileTitle(item: Locator, arrItem: string[]) {
    const collectionTileCount = await item.locator('a > collection-tile').count();
    const itemTileCount = await item.locator('a > item-tile').count();
    if (collectionTileCount === 1 && itemTileCount === 0) {
      arrItem.push('collection');
    } else if (collectionTileCount === 0 && itemTileCount === 1) {
      const tileIconTitle = await this.getTileIconTitleAttr(item);
      if (tileIconTitle) arrItem.push(tileIconTitle);
    }
  }

  async getDateMetadataText(item: Locator, arrItem: DateMetadataLabel[]) {
    const dateSpanLabel = await item
      .locator('#dates-line > div.metadata')
      .last()
      .innerText();

    if (dateSpanLabel) {
      // Need to split date filter and date format value: Published: 2150 or Published: Nov 15, 2023
      // Ideal format: { filter: 'Published', date: '2150' }
      const strSplitColonSpace = dateSpanLabel.split(': ');
      const objDateLine = {
        filter: strSplitColonSpace[0],
        date: strSplitColonSpace[1],
      };
      arrItem.push(objDateLine);
    }
  }

  async getTileIconTitleAttr(item: Locator) {
    // Get mediatype-icon title attr from tile-stats row element
    return await item.locator('#stats-row > li:nth-child(1) > mediatype-icon > #icon').getAttribute('title');
  }

  async getAllInfiniteScrollerArticleItems() {
    const container = this.infiniteScroller.locator('section#container');
    await container.waitFor({ state: 'visible' })
    return await container.locator('article').all();
  }

  async getFacetedResultsByViewFacetGroup(
    viewFacetMetadata: ViewFacetMetadata,
    displayItemCount: Number,
  ): Promise<string[] | null> {
    let arrIdentifiers: string[];
    const arrTitles: string[] = [];
    const arrDates: DateMetadataLabel[] = [];
    const allItems = await this.getAllInfiniteScrollerArticleItems();

    let index = 0;
    while (index !== displayItemCount) {
      await allItems[index].locator('tile-dispatcher').waitFor({ state: 'visible' });

      switch(viewFacetMetadata) {
        case 'tile-collection-icon-title':
          await this.getCollectionItemTileTitle(allItems[index], arrTitles);
          break;
        
        case 'tile-icon-title':
          await this.getItemTileIconTitle(allItems[index], arrTitles);
          break;
        
        case 'list-date':
          await this.getDateMetadataText(allItems[index], arrDates);
          break;
      
        default: // something else ---- test is broken
          break;
      }

      index++;
    }

    arrIdentifiers = arrDates.length !== 0 
      ? arrDates.map(label => label.date)
      : arrTitles;
    return arrIdentifiers;
  }

}