import { type Page, type Locator, expect } from '@playwright/test';

import { SortOrder, SortFilter, SortFilterURL } from '../models';

export class CollectionBrowser {
  readonly page: Page;
  readonly emptyPlaceholder: Locator;
  readonly emptyPlaceholderTitleText: Locator;
  readonly formInputSearchPage: Locator;
  readonly formInputRadioPage: Locator;
  readonly formInputTVPage: Locator;
  readonly formInputWaybackPage: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.emptyPlaceholder = page.locator('empty-placeholder');
    this.emptyPlaceholderTitleText = this.emptyPlaceholder.locator('h2.title');

    this.formInputRadioPage = page.locator('input#text-input');
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

  async validateTVPage(query: string) {
    // Note: The page is redirected to TV search page
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
    await this.page.waitForURL(/sin=RADIO/);
    await expect(this.formInputRadioPage).toBeVisible();
    expect(await this.formInputRadioPage.inputValue()).toContain(query);
  }

  async validateWaybackPage(query: string) {
    // Note: The page is redirected to Wayback Machine search page
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
}
