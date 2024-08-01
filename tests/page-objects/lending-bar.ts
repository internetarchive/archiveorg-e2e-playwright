import { type Page, Locator, expect } from '@playwright/test';

export class LendingBar {
  readonly page: Page;
  readonly iaBookActions: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.iaBookActions = this.page.locator('ia-book-actions');
  }

  async verifyDefaultTexts() {
    const textGroup = await this.iaBookActions.locator('text-group > .variable-texts');
    const textGroupTexts = await textGroup.textContent();

    await expect(textGroup).toBeVisible();
    await expect(textGroupTexts).toContain('Renewable every hour, pending availability.');
  }

  async verifyInfoIcon() {
    const infoIcon = await this.iaBookActions.locator('info-icon');
    const infoIconUrl = await infoIcon.locator('a').getAttribute('href');

    await expect(infoIcon).toBeVisible();
    await expect(infoIconUrl).toContain('https://help.archive.org/help/borrowing-from-the-lending-library');
  }

  async verifyLendingBarBasicNonLoggedIn() {
    await expect(this.iaBookActions).toBeVisible();

    const actionGroup = await this.iaBookActions.locator('collapsible-action-group');
    const primaryAction = await actionGroup.locator('button.initial').first();
    const primaryActionText = await primaryAction.textContent();

    await expect(actionGroup).toBeVisible();
    await expect(primaryAction).toBeVisible();
    await expect(primaryActionText).toContain('Log In and Borrow');

    // click on this primaryAction button should send you on login page
    await primaryAction.click();

    // wait for navigation to complete
    await this.page.waitForLoadState('load');

    // Assert that the current URL contains a specific substring or matches a pattern
    await expect(this.page.url()).toContain('/account/login');
  }

  async verifyLendingBarLoggedIn() {
    const actionGroup = await this.iaBookActions.locator('collapsible-action-group');
    const borrowButton = await actionGroup.locator('button.initial').first();
    const borrowButtonText = await borrowButton.textContent();

    await expect(actionGroup).toBeVisible();

    if (borrowButtonText?.includes('Borrow for 1 hour')) {
      // case before user has borrowed book
      await expect(borrowButton).toBeVisible();
      await expect(borrowButtonText).toContain('Borrow for 1 hour');

      // click on this primaryAction button should send you on login page
      await borrowButton.click();
  
      // wait for navigation to complete
      await this.page.waitForLoadState('load');
    } else {
      // case after user has borrowed book
      const iaBookActions = await this.page.locator('ia-book-actions');
      const returnNowButton = await iaBookActions.locator('button.ia-button').first();
      const returnNowButtonText = await returnNowButton.textContent();

      await expect(returnNowButton).toBeVisible();
      await expect(returnNowButtonText).toContain('Return now');

      // click on this primaryAction button should send you on login page
      await returnNowButton.click();
        
      // wait for navigation to complete
      await this.page.waitForLoadState('load');
    }
  }
}
