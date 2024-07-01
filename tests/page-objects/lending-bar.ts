import { type Page, Locator, expect } from '@playwright/test';
// import clock
// import clock
// import { createClock as rawCreateClock, install as rawInstall } from '../../packages/playwright-core/src/server/injected/clock';
// import type { InstallConfig, ClockController, ClockMethods } from '../../packages/playwright-core/src/server/injected/clock';

export class LendingBar {
  readonly page: Page;

  readonly iaBookActions: Locator;
  readonly demoControls: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.iaBookActions = this.page.locator('ia-book-actions');
    this.demoControls = this.page.locator('.initial');
  }

  async gotoPage(uri: string) {
    await this.page.goto(uri, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(5000);
  }


  // auto renew feature testing starts from here....
  // auto renew feature testing starts from here....
  // auto renew feature testing starts from here....
  // auto renew feature testing starts from here....
  // auto renew feature testing starts from here....
  // auto renew feature testing starts from here....
  // auto renew feature testing starts from here....
  async autoRenew_verifyDefaultTexts() {
    const textGroup = await this.iaBookActions.locator('text-group > .variable-texts');
    const textGroupTexts = await textGroup.textContent();

    await expect(textGroup).toBeVisible();
    await expect(textGroupTexts).toContain('Renews automatically with continued use.');
  }

  async autoRenew_userJustBrowsed() {
    const browsedCheckbox = await this.demoControls.getByText('user_has_browsed', { exact: true });
    await browsedCheckbox.click();

    // ERRRRRRRRRRRRRRRRRRRR
    await this.page.clock.install({ time: new Date('2024-02-02T08:00:00') });

    console.log(this.iaBookActions)
    // wait for navigation to complete
    await this.page.waitForTimeout(10000);
  }

  // auto renew feature testing ends from here....
  // auto renew feature testing ends from here....
  // auto renew feature testing ends from here....
  // auto renew feature testing ends from here....
  // auto renew feature testing ends from here....
  // auto renew feature testing ends from here....
  // auto renew feature testing ends from here....


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
