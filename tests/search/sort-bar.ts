import { type Page, type Locator, expect } from '@playwright/test';

export class SortBar {
  readonly page: Page;
  readonly sortFilterBar: Locator;
  readonly sortSelector: Locator;
  readonly btnSortDirection: Locator;
  readonly alphaBar: Locator;
  readonly srSortText: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.sortFilterBar = page.locator('sort-filter-bar');
    this.sortSelector = this.sortFilterBar.locator('ul#desktop-sort-selector');
    this.btnSortDirection = this.sortFilterBar.locator('.sort-direction-icon');
    this.alphaBar = page.locator('alpha-bar');
    this.srSortText = this.sortFilterBar.locator('button.sort-direction-selector span.sr-only');
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

  async clickSortDirection () {
    await this.btnSortDirection.click();
  }

  async clickAlphaBarLetterByPosition (pos: number) {
    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const nthLetter = this.alphaBar.locator('#container ul > li').nth(pos);
    const letterSelected = this.alphaBar.locator('#container ul > li.selected');
  
    await nthLetter.click();

    // assertion .toEqual has deep equality error in webkit
    expect(await nthLetter.innerText()).toContain(alphabet[pos]);
    expect(await letterSelected.count()).toEqual(1);
  }

  async clearAlphaBar () {
    const letterSelected = this.alphaBar.locator('#container ul > li.selected');
    expect(await letterSelected.count()).toEqual(0);
  }
}
