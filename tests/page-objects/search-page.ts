import { type Page, type Locator, expect } from '@playwright/test';

import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

import { SearchOption, SortOrder, SortFilter, SortFilterURL } from '../models';

export class SearchPage {
  readonly page: Page;
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearAllFilters: Locator;
  readonly btnClearInput: Locator;
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

    this.btnCollectionSearchInputGo = page.locator(
      'collection-search-input #go-button',
    );
    this.btnCollectionSearchInputCollapser = page.locator(
      'collection-search-input #button-collapser',
    );
    this.btnClearAllFilters = page.locator(
      '#facets-header-container div.clear-filters-btn-row button',
    );
    this.btnClearInput = page.locator('collection-search-input #clear-button');
    this.emptyPlaceholder = page.locator('empty-placeholder');
    this.emptyPlaceholderTitleText = this.emptyPlaceholder.locator('h2.title');

    this.formInputSearchPage = page.locator(
      'collection-search-input #text-input',
    );
    this.formInputRadioPage = page.locator(
      '#searchform > div > div:nth-child(1) > input.js-search-bar',
    );
    this.formInputTVPage = page.locator(
      '#searchform > div > div:nth-child(1) > input.js-search-bar',
    );
    this.formInputWaybackPage = page.locator(
      'input.rbt-input-main.form-control.rbt-input',
    );

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit() {
    await this.page.goto('/search');
  }

  async validateEmptyPagePlaceholder() {
    await expect(this.emptyPlaceholder).toBeVisible({ timeout: 60000 });
    await expect(this.emptyPlaceholderTitleText).toBeVisible({
      timeout: 60000,
    });
  }

  async queryFor(query: string) {
    await this.formInputSearchPage.fill(query);
    await this.formInputSearchPage.press('Enter', { timeout: 60000 });
  }

  async validateSearchInput(query: string) {
    expect(await this.formInputSearchPage.inputValue()).toBe(query);
  }

  async clickClearAllFilters() {
    await expect(this.btnClearAllFilters).toBeVisible({ timeout: 60000 });
    await this.btnClearAllFilters.click();
  }

  async clickClearSearchInput() {
    await this.btnClearInput.click();
  }

  async clickSearchInputOption(option: SearchOption) {
    await expect(this.btnCollectionSearchInputGo).toBeVisible({
      timeout: 5000,
    });
    await expect(this.formInputSearchPage).toBeVisible({ timeout: 60000 });

    await this.formInputSearchPage.click({ force: true });
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await expect(
      this.btnCollectionSearchInputCollapser.getByText(option),
    ).toBeVisible({ timeout: 60000 });
    await this.btnCollectionSearchInputCollapser
      .getByText(option)
      .click({ force: true });
  }

  async goBackToSearchPage() {
    await this.visit();
  }

  async assertClearAllFiltersNotVisible() {
    await this.page.waitForLoadState();
    await expect(this.btnClearAllFilters).not.toBeVisible({ timeout: 60000 });
  }

  async validateTVPage(query: string) {
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    expect(await this.page.title()).toContain('Internet Archive TV NEWS');
    await expect(
      this.page.getByRole('link', { name: 'TV News Archive', exact: true }),
    ).toBeVisible({ timeout: 60000 });
    await expect(
      this.page.getByRole('heading', { name: 'Search' }),
    ).toBeVisible({ timeout: 60000 });
    await expect(this.formInputTVPage).toBeVisible({ timeout: 60000 });
    expect(await this.formInputTVPage.inputValue()).toContain(query);
  }

  async validateRadioPage(query: string) {
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    await expect(this.formInputRadioPage).toBeVisible({ timeout: 60000 });
    expect(await this.formInputRadioPage.inputValue()).toContain(query);
  }

  async validateWaybackPage(query: string) {
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
    expect(await this.page.title()).toContain('Wayback Machine');
    await expect(this.formInputWaybackPage).toBeVisible({ timeout: 60000 });
    expect(await this.formInputWaybackPage.inputValue()).toContain(query);
  }

  async validateCompactViewModeListLineDateHeaders(filter: SortFilter) {
    const checkFilterText = filter
      .split('Date ')[1]
      .replace(/^./, (str: string) => str.toUpperCase());
    expect(
      await this.page
        .locator('tile-list-compact-header #list-line-header #date')
        .innerText(),
    ).toContain(checkFilterText);
  }

  async validateURLParamsWithSortFilter(filter: SortFilter, order: SortOrder) {
    const sortFilterURL =
      order === 'descending'
        ? `-${SortFilterURL[filter]}`
        : SortFilterURL[filter];
    const urlPatternCheck = new RegExp(`sort=${sortFilterURL}`);
    await expect(this.page).toHaveURL(urlPatternCheck);
  }

  async validateClearSearchInput() {
    await expect(this.btnClearInput).not.toBeVisible({ timeout: 60000 });
    expect(await this.formInputSearchPage.inputValue()).toBe('');
  }
}
