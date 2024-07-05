import { type Page, Locator, expect } from '@playwright/test';

export class LendingBarAutoRenew {
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

    await this.page.clock.fastForward('01:20'); // (MM:SS)

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    await this.page.clock.fastForward('05:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).toBeVisible();
  }

  async autoRenew_userJustBrowsedFor5MinRenewed() {
    await this.clickOnBrowsedButton();

    const totalLoanSeconds = 300;

    // install clock timer is -- 300000ms / 300s / 5min
    await this.page.clock.install(Number(this.loanSecondsFor5Min) * 1000);

    await this.page.clock.fastForward('01:20'); // (MM:SS)

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

    await this.page.clock.fastForward('02:00'); // (MM:SS)
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

    await this.page.clock.fastForward('02:20'); // (MM:SS)

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    await this.page.clock.fastForward('08:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async autoRenew_userJustBrowsedFor10MinRenewed() {
    await this.clickOnBrowsedButton();

    await this.page.clock.install(Number(this.loanSecondsFor10Min) * 1000);

    await this.page.clock.fastForward('02:20'); // (MM:SS)

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

    await this.page.clock.fastForward('05:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).not.toBeVisible();
  }

  async autoRenew_autoRenewWhenUserMakeActivity() {
    await this.clickOnBrowsedButton();
    await this.page.clock.install(Number(this.loanSecondsFor10Min) * 1000);

    await this.page.clock.fastForward('01:50'); // (MM:SS)

    // user made activity on BookReader
    const pageChangedElement = await this.page.locator('.pageChangedEvent');
    if (pageChangedElement) {
      await pageChangedElement.click();
      await this.page.clock.fastForward('01:55'); // (MM:SS)
      await this.page.waitForTimeout(5000);
    }

    // timer has been reset and match with total loan seconds... :)
    expect(await this.getTimerCountdownSeconds()).toEqual(this.loanSecondsFor10Min);

    await expect(this.page.locator('.backdrop')).not.toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).not.toBeVisible();
  }

  /**
   * 60 minutes loan tests, the timer details are as follow:-
   * - loanTotalTime: 3600,
   * - loanRenewAtLast: 660,
   * - pageChangedInLast: 900
   */
  async autoRenew_userJustBrowsedFor60Min() {
    await this.clickOnBrowsedButton();

    // install clock timer is -- 600000ms / 600s / 60min
    await this.page.clock.install(Number(this.loanSecondsFor60Min) * 1000);

    await this.page.clock.fastForward('51:10'); // (MM:SS)

    // after 240sec, we expected to warning message having backdrop
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();

    await this.page.clock.fastForward('10:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async autoRenew_userJustBrowsedFor60MinRenewed() {
    await this.clickOnBrowsedButton();

    await this.page.clock.install(Number(this.loanSecondsFor60Min) * 1000);

    await this.page.clock.fastForward('51:10'); // (MM:SS)

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
    expect(await this.getTimerCountdownSeconds()).toEqual(this.loanSecondsFor60Min);

    await this.page.clock.fastForward('10:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).not.toBeVisible();
  }


  async autoRenew_autoRenew60MinWhenUserMakeActivity() {
    await this.clickOnBrowsedButton();
    await this.page.clock.install(Number(this.loanSecondsFor60Min) * 1000);

    await this.page.clock.fastForward('45:10'); // (MM:SS)

    // user made activity on BookReader
    const pageChangedElement = await this.page.locator('.pageChangedEvent');
    if (pageChangedElement) {
      await pageChangedElement.click();
      await this.page.clock.fastForward('10:10'); // (MM:SS)
      await this.page.waitForTimeout(6000);
    }

    // timer has been reset and match with total loan seconds... :)
    expect(await this.getTimerCountdownSeconds()).toEqual(this.loanSecondsFor60Min);

    await expect(this.page.locator('.backdrop')).not.toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).not.toBeVisible();
  }
}
