import { type Page, Locator, expect } from '@playwright/test';

export class LendingBar {
  readonly page: Page;

  readonly iaBookActions: Locator;
  readonly demoControls: Locator;

  readonly loanSecondsFor5Min: Number;
  readonly loanSecondsFor10Min: Number;
  readonly loanSecondsFor30Min: Number;
  readonly loanSecondsFor60Min: Number;

  public constructor(page: Page) {
    this.page = page;

    this.iaBookActions = this.page.locator('ia-book-actions');
    this.demoControls = this.page.locator('.initial');

    this.loanSecondsFor5Min = 300; // seconds
    this.loanSecondsFor10Min = 600; // seconds 
    this.loanSecondsFor30Min = 1800; // seconds
    this.loanSecondsFor60Min = 3600; // seconds
  }

  async clickOnBrowsedButton() {
    const timeInBrowser = await this.page.evaluate(() => {
      return new Date().toString();
    });
    console.log(timeInBrowser);

    const browsedCheckbox = this.demoControls.getByText('user_has_browsed', { exact: true });
    await browsedCheckbox.click();
  }

  async gotoPage(uri: string) {
    await this.page.goto(uri, { waitUntil: 'networkidle' });

    await this.page.clock.setSystemTime(new Date().toISOString());
    await this.page.waitForTimeout(1000);
  }

  async getTimerCountdownSeconds() {
    const timerElement = this.page.locator('timer-countdown .second');
    if (timerElement) return Number(await timerElement.textContent());
    return false;
  }

  // auto renew feature testing starts from here....
  /**
   * 5 minutes loan tests, the timer details are as follow:-
   * - loanTotalTime: 300,
   * - loanRenewAtLast: 240,
   * - pageChangedInLast: 60
   */
  async autoRenew_userJustBrowsedFor5Min() {
    await this.clickOnBrowsedButton();

    // install clock timer is -- 300000ms / 300s / 5min
    await this.page.clock.install(Number(this.loanSecondsFor5Min) * 1000);

    // fast-forward timer by -- 01:10 / 70s
    await this.page.clock.fastForward('01:20'); // 1m10s

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    // again fast-forward timer by -- 03:02 / 180s
    await this.page.clock.fastForward('05:00');
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).toBeVisible();
  }

  async autoRenew_userJustBrowsedFor5MinRenewed() {
    await this.clickOnBrowsedButton();

    const totalLoanSeconds = 300;

    // install clock timer is -- 300000ms / 300s / 5min
    await this.page.clock.install(Number(this.loanSecondsFor5Min) * 1000);

    // fast-forward timer by -- 01:10 / 70s
    await this.page.clock.fastForward('01:20'); // 1m10s

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    await expect(this.page.locator('#book-action-bar-custom-buttons')).toBeVisible();

    const keepReadingButton = this.page.locator('#book-action-bar-custom-buttons button').first();
    if (keepReadingButton) {
      await keepReadingButton.click();
      await this.page.waitForTimeout(1000);
    }

    await expect(this.page.locator('.backdrop')).not.toBeVisible();

    // timer has been reset and match with total loan seconds... :)
    expect(await this.getTimerCountdownSeconds()).toEqual(this.loanSecondsFor5Min);

    // again fast-forward timer by -- 03:02 / 180s
    await this.page.clock.fastForward('02:00');
    await this.page.waitForTimeout(1000);

    await expect(this.page.locator('.backdrop')).toBeVisible();
  }

  /**
   * 10 minutes loan tests, the timer details are as follow:-
   * - loanTotalTime: 600,
   * - loanRenewAtLast: 480,
   * - pageChangedInLast: 120
   */
  async autoRenew_userJustBrowsedFor10Min() {
    await this.clickOnBrowsedButton();

    // install clock timer is -- 600000ms / 600s / 10min

    await this.page.clock.install(Number(this.loanSecondsFor10Min) * 1000);

    // fast-forward timer by -- 01:10 / 70s
    await this.page.clock.fastForward('02:20'); // 1m10s

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    // // again fast-forward timer by -- 03:02 / 180s
    await this.page.clock.fastForward('08:00');
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async autoRenew_userJustBrowsedFor10MinRenewed() {
    await this.clickOnBrowsedButton();

    await this.page.clock.install(Number(this.loanSecondsFor10Min) * 1000);

    // fast-forward timer by -- 01:10 / 70s
    await this.page.clock.fastForward('02:20'); // 1m10s

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    await expect(this.page.locator('#book-action-bar-custom-buttons')).toBeVisible();

    const keepReadingButton = this.page.locator('#book-action-bar-custom-buttons button').first();
    if (keepReadingButton) {
      await keepReadingButton.click();
      await this.page.waitForTimeout(1000);
    }

    await expect(this.page.locator('.backdrop')).not.toBeVisible();

    // timer has been reset and match with total loan seconds... :)
    expect(await this.getTimerCountdownSeconds()).toEqual(this.loanSecondsFor10Min);

    // again fast-forward timer by -- 03:02 / 180s
    await this.page.clock.fastForward('05:00');
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).not.toBeVisible();
  }

  async autoRenew_autoRenewWhenUserMakeActivity() {
    await this.clickOnBrowsedButton();
    await this.page.clock.install(Number(this.loanSecondsFor10Min) * 1000);

    // fast-forward timer by -- 01:10 / 70s
    await this.page.clock.fastForward('01:50'); // 1m10s

    // user made activity on BookReader
    const pageChangedElement = await this.page.locator('.pageChangedEvent');
    if (pageChangedElement) {
      await pageChangedElement.click();
      await this.page.clock.fastForward('01:55'); // 1m10s
      await this.page.waitForTimeout(5000);
    }

    // timer has been reset and match with total loan seconds... :)
    expect(await this.getTimerCountdownSeconds()).toEqual(this.loanSecondsFor10Min);

    await expect(this.page.locator('.backdrop')).not.toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).not.toBeVisible();
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
