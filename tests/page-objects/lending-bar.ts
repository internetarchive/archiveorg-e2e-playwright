import { type Page, Locator } from '@playwright/test';

import IABookActions from '@internetarchive/ia-book-actions';
export class LendingBar {
  readonly page: Page;

  readonly bookActions: Locator;
  readonly iaBookActions: IABookActions;

  public constructor(page: Page) {
    this.page = page;

    this.iaBookActions = new IABookActions();

    this.bookActions= this.page.locator('ia-book-actions');

    this.iaBookActions.userid = '@neeraj-archive';
    this.iaBookActions.identifier = 'naturalhistoryof00unse_4111';
    this.iaBookActions.bookTitle = 'This is test title for any book';
  }
  

  async doTestTimers() {
    // this.page.waitForTimeout(1 * 60 * 1000) // wait for 1min
    // this.page.waitForTimeout(2 * 60 * 1000) // wait for 2mins
  }


}
