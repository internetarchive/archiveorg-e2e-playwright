import { type Page, type Locator } from '@playwright/test';

export class SortBar {
  readonly page: Page;
  readonly sortSelector: Locator;
  readonly btnSortDirection: Locator;
  readonly alphaBar: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.sortSelector = page.locator('sort-filter-bar ul#desktop-sort-selector');
    this.btnSortDirection = page.locator('sort-filter-bar .sort-direction-icon');
    this.alphaBar = page.locator('alpha-bar');
  }

  async buttonClick (sortName: string) {
    await this.page.getByRole('button', { name: sortName }).click();
  }

  async caratButtonClick (sortName: string) {
    await this.page.getByRole('button', { name: sortName }).getByRole('button').click();
  }

  async textClick (name: string) {
    await this.page.getByText(name).first().click();
  }

}
