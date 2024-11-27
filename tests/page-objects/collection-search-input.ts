import { type Page, type Locator, expect } from '@playwright/test';

import { SearchOption } from '../models';

export class CollectionSearchInput {
  readonly page: Page;

  readonly collectionSearchInput: Locator;
  readonly btnCollectionSearchInputGo: Locator;
  readonly btnCollectionSearchInputCollapser: Locator;
  readonly btnClearInput: Locator;
  readonly formInputSearchPage: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.collectionSearchInput = this.page.locator('collection-search-input');
    this.formInputSearchPage = page.locator(
      'collection-search-input #text-input',
    );
    this.btnCollectionSearchInputGo = page.locator(
      'collection-search-input #go-button',
    );
    this.btnCollectionSearchInputCollapser = page.locator(
      'collection-search-input #button-collapser',
    );
    this.btnClearInput = page.locator('collection-search-input #clear-button');
  }

  async queryFor(query: string) {
    await this.formInputSearchPage.fill(query);
    await this.formInputSearchPage.press('Enter');
  }

  async validateSearchInput(query: string) {
    expect(await this.formInputSearchPage.inputValue()).toBe(query);
  }

  async clickClearSearchInput() {
    await this.btnClearInput.click();
  }

  async clickSearchInputOption(option: SearchOption, type: string) {
    const btnName = type === 'collection' ? 'Search this collection' : 'GO';

    await expect(
      this.collectionSearchInput.getByRole('button', { name: btnName }),
    ).toBeVisible();
    await this.formInputSearchPage.click({ force: true });
    await this.page.getByLabel('Search Options').getByText(option).click();
  }

  async validateClearSearchInput() {
    await expect(this.btnClearInput).not.toBeVisible();
    expect(await this.formInputSearchPage.inputValue()).toBe('');
  }
}
