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
    await this.page.getByRole('button', { name: sortName, }).getByRole('button').click();
  }

  async textClick (name: string) {
    await this.page.getByText(name).first().click();
  }

  async applySortBy (filter: string, direction: string) {
    const flatSortTextList = ['Relevance', 'Title', 'Creator'];

    const viewsDropdown = this.sortSelector.locator('li #views-dropdown');
    const dateDropdown = this.sortSelector.locator('li #date-dropdown');
    const viewsDropdownText = await viewsDropdown.innerText();
    const dateDropdownText = await dateDropdown.innerText();

    if (!flatSortTextList.includes(filter)) {
      const _toggleOption = filter.includes('views') ? viewsDropdownText : dateDropdownText;
      
      if (filter === _toggleOption) {
        await this.textClick(filter);
      } else {
        await this.caratButtonClick(`Toggle options ${_toggleOption}`);
        await this.buttonClick(filter);
      }
    } else {
      await this.buttonClick(filter);
    }

    await this.page.waitForLoadState()
    await this.checkAlphaBarVisibility(filter);

    // add test for sort direction here
    // if (direction) {
    //   this.clickSortDirection(direction);
    // }
  }

  async checkAlphaBarVisibility (filter: string) {
    if (!['Title', 'Creator'].includes(filter)) {
      await expect(this.alphaBar).not.toBeVisible();
    } else {
      await expect(this.alphaBar).toBeVisible();
    }
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

  async clearAlphaBarFilter () {
    const letterSelected = this.alphaBar.locator('#container ul > li.selected');
    expect(await letterSelected.count()).toEqual(0);
  }

  async alphaSortBarNotVisibile () {
    await expect(this.alphaBar).not.toBeVisible();
  } 

}
