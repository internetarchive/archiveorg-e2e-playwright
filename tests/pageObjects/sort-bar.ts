import { type Page, type Locator, expect } from '@playwright/test';

export type SortFilter = 
  | 'Weekly views' 
  | 'All-time views' 
  | 'Title' 
  | 'Date published'
  | 'Date archived'
  | 'Date reviewed'
  | 'Date added'
  | 'Creator';
export type SortOrder = 'ascending' | 'descending';
export type DateMetadataLabel = {
  filter: string,
  date: string
}

export class SortBar {
  readonly page: Page;
  readonly sortFilterBar: Locator;
  readonly sortSelector: Locator;
  readonly btnSortDirection: Locator;
  readonly alphaBar: Locator;
  readonly srSortText: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.alphaBar = page.locator('alpha-bar');
    this.sortFilterBar = page.locator('sort-filter-bar section#sort-bar');
    this.sortSelector = this.sortFilterBar.locator('ul#desktop-sort-selector');
    this.btnSortDirection = this.sortFilterBar.locator('.sort-direction-icon');
    this.srSortText = this.sortFilterBar.locator('button.sort-direction-selector span.sr-only');
  }

  viewsSorted(order: SortOrder, arr: Number[]) {
    if (order === 'ascending') {
      return arr.every((x, i) => i === 0 || x >= arr[i - 1]);
    } else {
      return arr.every((x, i) => i === 0 || x <= arr[i - 1]);
    }
  }

  datesSorted(order: SortOrder, arr: DateMetadataLabel[]) {
    if (order === 'ascending') {
      return arr.every((x, i) => i === 0 || new Date(x.date) >= new Date(arr[i - 1].date));
    } else {
      return arr.every((x, i) => i === 0 || new Date(x.date) <= new Date(arr[i - 1].date));
    }
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

  async applySortFilter (filter: string) {
    const flatSortTextList = ['Relevance', 'Title', 'Creator'];

    if (!flatSortTextList.includes(filter)) {
      const _toggleOption = filter.includes('views') 
        ? await this.sortSelector.locator('li #views-dropdown').innerText() 
        : await this.sortSelector.locator('li #date-dropdown').innerText();
      
      if (filter === _toggleOption) {
        await this.textClick(filter);
      } else {
        await this.caratButtonClick(`Toggle options ${_toggleOption}`);
        await this.buttonClick(filter);
      }
    } else {
      await this.buttonClick(filter);
    }
  }

  async clickSortDirection (sortOrder: SortOrder) {
     // TODO: may still need to find better way to check sort order
    const currentSortText = await this.srSortText.innerText();
    const oppositeSortText = sortOrder === 'ascending' ? 'descending' : 'ascending';

    if (currentSortText.includes(sortOrder)) {
      await this.btnSortDirection.click();
      await expect(this.srSortText).toContainText(`Change to ${oppositeSortText} sort`);
    }
  }

  async checkAlphaBarVisibility (filter: string) {
    if (!['Title', 'Creator'].includes(filter)) {
      await expect(this.alphaBar).not.toBeVisible();
    } else {
      await expect(this.alphaBar).toBeVisible();
    }
  }

  async clickAlphaBarLetterByPosition (pos: number) {
    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const nthLetter = this.alphaBar.locator('#container ul > li').nth(pos);
    const letterSelected = this.alphaBar.locator('#container ul > li.selected');
  
    await nthLetter.click();

    // Note: assertion .toEqual has deep equality error in webkit
    expect(await nthLetter.innerText()).toContain(alphabet[pos]);
    expect(await letterSelected.count()).toEqual(1);

    await this.page.waitForLoadState();
    await this.page.waitForTimeout(3000);
  }

  async clearAlphaBarFilter () {
    const letterSelected = this.alphaBar.locator('#container ul > li.selected');
    expect(await letterSelected.count()).toEqual(0);
  }

  async alphaSortBarNotVisibile () {
    await expect(this.alphaBar).not.toBeVisible();
  } 

}
