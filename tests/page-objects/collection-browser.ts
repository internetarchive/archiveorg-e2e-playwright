import { type Page, type Locator, expect } from '@playwright/test';

import { SearchOption, SortOrder, SortFilter, SortFilterURL } from '../models';

export class CollectionBrowser {
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
  }

  async validateEmptyPagePlaceholder() {
    await expect(this.emptyPlaceholder).toBeVisible();
    await expect(this.emptyPlaceholderTitleText).toBeVisible();
  }

  async queryFor(query: string) {
    await this.formInputSearchPage.fill(query);
    await this.formInputSearchPage.press('Enter');
  }

  async validateSearchInput(query: string) {
    expect(await this.formInputSearchPage.inputValue()).toBe(query);
  }

  async clickClearAllFilters() {
    await expect(this.btnClearAllFilters).toBeVisible();
    await this.btnClearAllFilters.click();
  }

  async clickClearSearchInput() {
    await this.btnClearInput.click();
  }

  async clickSearchInputOption(option: SearchOption, type: string) {
    const btnName = type === 'collection' ? 'Search this collection' : 'GO';

    await expect(this.page.getByRole('button', { name: btnName })).toBeVisible();
    await this.formInputSearchPage.click({ force: true });
    await this.page.getByLabel('Search Options').getByText(option).click();
  }

  async assertClearAllFiltersNotVisible() {
    await this.page.waitForLoadState();
    await expect(this.btnClearAllFilters).not.toBeVisible();
  }

  async validateTVPage(query: string) {
    // Note: The page is redirected to TV search page
    // await this.page.waitForLoadState('load');
    await this.page.waitForURL(/tv/);
    expect(await this.page.title()).toContain('Internet Archive TV NEWS');
    await expect(
      this.page.getByRole('link', { name: 'TV News Archive', exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole('heading', { name: 'Search' }),
    ).toBeVisible();
    await expect(this.formInputTVPage).toBeVisible();
    expect(await this.formInputTVPage.inputValue()).toContain(query);
  }

  async validateRadioPage(query: string) {
    // Note: The page is redirected to old search page
    // await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL(/sin=RADIO/);
    await expect(this.formInputRadioPage).toBeVisible();
    expect(await this.formInputRadioPage.inputValue()).toContain(query);
  }

  async validateWaybackPage(query: string) {
    // Note: The page is redirected to Wayback Machine search page
    // await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL(/web/);
    expect(await this.page.title()).toContain('Wayback Machine');
    await expect(this.formInputWaybackPage).toBeVisible();
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
    await expect(this.btnClearInput).not.toBeVisible();
    expect(await this.formInputSearchPage.inputValue()).toBe('');
  }
}
