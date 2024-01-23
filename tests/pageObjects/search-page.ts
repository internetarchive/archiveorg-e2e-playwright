import { type Page, type Locator, expect } from '@playwright/test';

import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

import { SearchOption, SortOrder, SortFilter, SortFilterURL } from '../models'

const PAGE_TIMEOUT = 3000;

export class SearchPage {
  readonly url: string = 'https://archive.org/search';
  readonly page: Page;
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearAllFilters: Locator;
  readonly emptyPlaceholder: Locator;
  readonly emptyPlaceholderTitleText: Locator;
  readonly formInputSearchPage: Locator;
  readonly formInputRadioPage: Locator;
  readonly formInputTVPage: Locator;
  readonly formInputWaybackPage: Locator;

  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.btnCollectionSearchInputGo = page.locator('collection-search-input #go-button');
    this.btnCollectionSearchInputCollapser = page.locator('collection-search-input #button-collapser');
    this.btnClearAllFilters = page.locator('#facets-header-container .clear-filters-btn');
    this.emptyPlaceholder = page.locator('empty-placeholder');
    this.emptyPlaceholderTitleText = this.emptyPlaceholder.locator('h2.title');

    this.formInputSearchPage = page.locator('collection-search-input #text-input');
    this.formInputRadioPage = page.locator('#searchform > div > div:nth-child(1) > input');
    this.formInputTVPage = page.locator('#searchform > div > div:nth-child(1) > input');
    this.formInputWaybackPage = page.locator('input.rbt-input-main.form-control.rbt-input');

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit() {
    await this.page.goto(this.url);
  }

  async checkEmptyPagePlaceholder() {
    await (expect(this.emptyPlaceholder).toBeVisible());
    await (expect(this.emptyPlaceholderTitleText).toBeVisible());
  }

  async queryFor(query: string) {
    await this.formInputSearchPage.fill(query);
    await this.formInputSearchPage.press('Enter');
    await this.page.waitForLoadState();
  }

  async displayResultCount() {
    await this.collectionFacets.checkResultCount();
  }

  async checkFacetGroups() {
    await this.displayResultCount();
    await this.collectionFacets.checkFacetGroups();
  }

  async navigateSortBy(filter: string, sortOrder: SortOrder) {
    await this.sortBar.applySortFilter(filter);
    await this.sortBar.clickSortDirection(sortOrder);
    await this.displayResultCount();
  }

  async clearAllFilters() {
    await expect(this.btnClearAllFilters).toBeVisible();
    await this.btnClearAllFilters.click();
    await this.sortBar.clearAlphaBarFilter();
    await this.displayResultCount();
    await expect(this.btnClearAllFilters).not.toBeVisible();
  }

  async clickSearchInputOption(option: SearchOption) {
    await expect(this.btnCollectionSearchInputGo).toBeVisible();
    await expect(this.formInputSearchPage).toBeVisible();

    await this.formInputSearchPage.click();
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    await expect(this.btnCollectionSearchInputCollapser.getByText(option)).toBeVisible();
    await this.btnCollectionSearchInputCollapser.getByText(option).click();
  }

  async checkTVPage(query: string) {
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    expect(await this.page.title()).toContain('Internet Archive TV NEWS');
    await expect(this.page.getByRole('link', { name: 'TV News Archive', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Search' })).toBeVisible();
    await expect(this.formInputTVPage).toBeVisible();
    expect(await this.formInputTVPage.inputValue()).toContain(query);
  }

  async checkRadioPage(query: string) {
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    await expect(this.formInputRadioPage).toBeVisible();
    expect(await this.formInputRadioPage.inputValue()).toContain(query);
  }

  async checkWaybackPage(query: string) {
    await this.page.waitForTimeout(PAGE_TIMEOUT);
    expect(await this.page.title()).toContain('Wayback Machine');
    await expect(this.formInputWaybackPage).toBeVisible();
    expect(await this.formInputWaybackPage.inputValue()).toContain(query);
  }

  async goBackToSearchPage() {
    await this.visit();
  }

  async checkCompactViewModeListLineDateHeaders (filter: SortFilter) {
    const checkFilterText = filter.split('Date ')[1].replace(/^./, (str: string) => str.toUpperCase());
    expect(await this.page.locator('tile-list-compact-header #list-line-header #date').innerText()).toContain(checkFilterText);
  }

  async checkURLParamsWithSortFilter (filter: SortFilter, order: SortOrder) {
    const sortFilterURL = order === 'descending' ? `-${SortFilterURL[filter]}` : SortFilterURL[filter];
    const urlPatternCheck = new RegExp(`sort=${sortFilterURL}`);
    await expect(this.page).toHaveURL(urlPatternCheck);
  }

}
