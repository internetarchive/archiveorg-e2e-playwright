import { type Page, Locator } from '@playwright/test';

export class LendingBar {
  readonly page: Page;

  readonly iaBookActions: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.iaBookActions = this.page.locator('ia-book-actions');
  }
}
