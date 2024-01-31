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
      .nth(0);
  }

  async awaitLoadingState() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async clickViewMode(viewModeLocator: LayoutViewModeLocator) {
    await this.displayStyleSelectorOptions.locator(viewModeLocator).click();
  }

  async assertLayoutViewModeChange(viewMode: LayoutViewMode) {
    switch (viewMode) {
      case 'tile':
        await expect(
          this.displayStyleSelector.locator('#grid-button'),
        ).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/grid/));
        return;
      case 'list':
        await expect(
          this.displayStyleSelector.locator('#list-detail-button'),
        ).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/list-detail/));
        return;
      case 'compact':
        await expect(
          this.displayStyleSelector.locator('#list-compact-button'),
        ).toHaveClass('active');
        expect(await expect(this.infiniteScroller).toHaveClass(/list-compact/));
        return;
      default:
        return;
    }
  }

  async hoverToFirstItem() {
    await this.awaitLoadingState();
    expect(await this.firstItemTile.count()).toBe(1);

    await this.firstItemTile.hover();
    await expect(this.firstItemTile.locator('tile-hover-pane')).toBeVisible();
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
    await this.page.waitForLoadState('networkidle');
    expect(await this.firstItemTile.count()).toBe(1);

    // Get item tile link to compare with the redirect URL
    const itemLink = await this.firstItemTile
      .locator('a')
      .first()
      .getAttribute('href');
    const pattern = new RegExp(`${itemLink}`);
    await this.firstItemTile.click();

    await this.page.waitForLoadState();
    await expect(this.page).toHaveURL(pattern);
  }

  // TODO: per sort filter and sort order + view mode???
  async checkSortingResults(
    filter: SortFilter,
    order: SortOrder,
    displayItemCount: Number,
  ) {
    // This test is only applicable in tile view mode for "views" filters
    if (filter === 'Weekly views' || filter === 'All-time views') {
      await this.awaitLoadingState();
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
      await this.awaitLoadingState();
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

  async checkIncludedFacetedResults(
    viewFacetMetadata: ViewFacetMetadata,
    facetLabels: string[],
    toInclude: boolean,
    displayItemCount: Number,
  ) {
    await this.awaitLoadingState();
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

  async checkFirstItemResult() {
    await expect(this.firstItemTile).toBeVisible();
  }

  // Getters
  async getTileStatsViewCountTitles(
    displayItemCount: Number,
  ): Promise<string[]> {
    const arrTileStatsTitle: string[] = [];
    const allItems = await this.infiniteScrollerSectionContainer
      .locator('article')
      .all();

    // Load first 10 items and get tile stats views title
    let index = 0;
    while (index !== displayItemCount) {
      const collectionTileCount = await allItems[index]
        .locator('a > collection-tile')
        .count();
      const itemTileCount = await allItems[index]
        .locator('a > item-tile')
        .count();

      if (collectionTileCount === 1 && itemTileCount === 0) {
        console.log('it is a collection tile - do nothing for now');
      } else if (collectionTileCount === 0 && itemTileCount === 1) {
        // Get view count from tile-stats row
        const tileStatsTitle = await allItems[index]
          .locator('#stats-row > li:nth-child(2)')
          .getAttribute('title');
        if (tileStatsTitle) arrTileStatsTitle.push(tileStatsTitle);
      } else {
        console.log('it is not a collection-tile nor an item-tile');
      }

      index++;
    }

    return arrTileStatsTitle;
  }

  async getDateMetadataLabels(
    displayItemCount: Number,
  ): Promise<DateMetadataLabel[]> {
    const arrDateLine: DateMetadataLabel[] = [];
    const allItems = await this.infiniteScrollerSectionContainer
      .locator('article')
      .all();

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
        // Sample object: { filter: 'Published', date: '2150' }
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

  async getTileIconTitle(displayItemCount: Number): Promise<string[]> {
    const arrTileIconTitle: string[] = [];
    const allItems = await this.infiniteScrollerSectionContainer
      .locator('article')
      .all();

    let index = 0;
    while (index !== displayItemCount) {
      // Load items based on displayItemCount
      // Get mediatype-icon title from tile-stats row
      const tileIcon = allItems[index].locator(
        '#stats-row > li:nth-child(1) > mediatype-icon > #icon',
      );
      const tileIconTitle = await tileIcon.getAttribute('title');
      if (tileIconTitle) arrTileIconTitle.push(tileIconTitle);

      index++;
    }

    return arrTileIconTitle;
  }

  async getFacetedResultsByViewFacetGroup(
    viewFacetMetadata: ViewFacetMetadata,
    displayItemCount: Number,
  ): Promise<string[] | null> {
    switch (viewFacetMetadata) {
      case 'tile-icontitle':
        return await this.getTileIconTitle(displayItemCount);

      case 'list-date':
        const dateLabels = await this.getDateMetadataLabels(displayItemCount);
        if (dateLabels) return dateLabels.map(label => label.date);

        return null;

      default:
        return null;
    }
  }
}
