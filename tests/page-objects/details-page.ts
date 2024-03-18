import { type Page, type Locator, expect } from '@playwright/test';

export class DetailsPage {
  readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  async gotoPage(uri: string) {
    await this.page.goto(`/details/${uri}`, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(5000);
  }
}
