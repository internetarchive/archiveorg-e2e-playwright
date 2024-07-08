import { type Page, Locator, expect } from '@playwright/test';

export class LendingBarAutoRenew {
  readonly page: Page;

  readonly iaBookActions: Locator;
  readonly demoControls: Locator;

  readonly loanSecondsFor5Min: Number;
  readonly loanSecondsFor10Min: Number;
  readonly loanSecondsFor30Min: Number;
  readonly loanSecondsFor60Min: Number;

  private timeInBrowser: Date;

  public constructor(page: Page) {
    this.page = page;

    this.iaBookActions = this.page.locator('ia-book-actions');
    this.demoControls = this.page.locator('.initial');

    this.loanSecondsFor5Min = 300; // seconds
    this.loanSecondsFor10Min = 600; // seconds 
    this.loanSecondsFor30Min = 1800; // seconds
    this.loanSecondsFor60Min = 3600; // seconds

    this.timeInBrowser = new Date('2024-07-08T11:00:00'); // time
  }

  async clickOnBrowsedButton() {
    const browsedCheckbox = this.demoControls.getByText('user_has_browsed', { exact: true });
    await browsedCheckbox.click();
  }

  async gotoPage(uri: string) {
    await this.page.goto(uri, { waitUntil: 'networkidle' });

    this.timeInBrowser = await this.page.evaluate(() => {
      // return new Date().toISOString();
      return new Date('2024-07-08T11:00:00');
    });
    console.log('timeInBrowser:', this.timeInBrowser);

    await this.page.clock.setSystemTime(this.timeInBrowser.toString());
    await this.page.waitForTimeout(1000);
  }

  async getTimerCountdownSeconds() {
    const timerElement = this.page.locator('timer-countdown .second');
    if (timerElement) return Number(await timerElement.textContent());
    return false;
  }

  async getIncrementedTime(Minutes: number) {
    const timeObj = new Date(this.timeInBrowser.toString());
    const incresedTime = new Date(timeObj.getTime() + Minutes * 60000);
    console.log('originalTime: ', timeObj)
    console.log('incresedTime: ', incresedTime);
    return incresedTime;
  }

  async warningModelVisible() {
    await expect(await this.page.locator('.backdrop')).toBeVisible();
    await expect(await this.page.getByText('Are you still reading?')).toBeVisible();
  }


  async warningModelHidden() {
    await expect(await this.page.locator('.backdrop')).toBeHidden();
    await expect(await this.page.getByText('Are you still reading?')).toBeHidden();
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
    await this.page.clock.install({ time: await this.getIncrementedTime(5) });

    await this.page.clock.runFor('01:20'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // after 240sec, we expected to warning message having backdrop
    await this.warningModelVisible();

    await this.page.clock.runFor('04:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(this.page.getByText('This book has been returned')).toBeVisible();
  }

  async autoRenew_userJustBrowsedFor5MinRenewed() {
    await this.clickOnBrowsedButton();

    // install clock timer is -- 300000ms / 300s / 5min
    await this.page.clock.install({ time: await this.getIncrementedTime(5) });

    await this.page.clock.runFor('01:25'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // after 240sec, we expected to warning message having backdrop
    await this.warningModelVisible();

    await expect(await this.page.locator('#book-action-bar-custom-buttons')).toBeVisible();

    const keepReadingButton = await this.page.locator('#book-action-bar-custom-buttons button').first();
    if (keepReadingButton) {
      await keepReadingButton.click();
      await this.page.waitForTimeout(1000);
      // await this.page.clock.runFor(70000);
    }

    await expect(await this.page.locator('.backdrop')).toBeHidden();

    // timer has been reset and match with total loan seconds... :)
    await expect(await this.getTimerCountdownSeconds()).toBeGreaterThanOrEqual(250);

    await this.page.clock.runFor('02:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(await this.page.locator('.backdrop')).toBeVisible();
  }

  async autoRenew_autoRenew5MinWhenUserMakeActivity() {
    await this.clickOnBrowsedButton();
    await this.page.clock.install({ time: await this.getIncrementedTime(5) });

    await this.page.clock.runFor('00:30'); // (MM:SS)
    await this.page.waitForTimeout(10000);

    // user made activity on BookReader
    const pageChangedElement = await this.page.locator('.pageChangedEvent');
    if (pageChangedElement) {
      await pageChangedElement.click();
      await this.page.clock.runFor('00:40'); // (MM:SS)
      await this.page.waitForTimeout(7000);
    }

    // timer has been reset and match with total loan seconds... :)
    await expect(await this.getTimerCountdownSeconds()).toBeGreaterThanOrEqual(240);

    await expect(await this.page.locator('.backdrop')).toBeHidden();
    await expect(await this.page.getByText('Are you still reading?')).toBeHidden();
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

    await this.page.clock.install({ time: await this.getIncrementedTime(10) });

    await this.page.clock.runFor('02:20'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // after 240sec, we expected to warning message having backdrop
    await this.warningModelVisible();
    
    await this.page.clock.runFor('08:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(await this.page.getByText('This book has been returned')).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async autoRenew_userJustBrowsedFor10MinRenewed() {
    await this.clickOnBrowsedButton();

    await this.page.clock.install({ time: await this.getIncrementedTime(10) });

    await this.page.clock.runFor('02:20'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // after 240sec, we expected to warning message having backdrop
    await this.warningModelVisible();

    await expect(await this.page.locator('#book-action-bar-custom-buttons')).toBeVisible();

    const keepReadingButton = await this.page.locator('#book-action-bar-custom-buttons button').first();
    if (keepReadingButton) {
      await keepReadingButton.click();
      await this.page.waitForTimeout(1000);
    }

    await expect(await this.page.locator('.backdrop')).toBeHidden();

    // timer has been reset and match with total loan seconds... :)
    expect(await this.getTimerCountdownSeconds()).toBeGreaterThan(550);

    await this.page.clock.runFor('05:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(await this.page.getByText('This book has been returned')).toBeHidden();
  }

  async autoRenew_autoRenew10MinWhenUserMakeActivity() {
    await this.clickOnBrowsedButton();
    await this.page.clock.install({ time: await this.getIncrementedTime(10) });

    await this.page.clock.runFor('01:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // user made activity on BookReader
    const pageChangedElement = await this.page.locator('.pageChangedEvent');
    if (pageChangedElement) {
      await pageChangedElement.click();
      await this.page.clock.runFor('01:00'); // (MM:SS)
      await this.page.waitForTimeout(7000);
    }

    // timer has been reset and match with total loan seconds... :)
    await expect(await this.getTimerCountdownSeconds()).toBeGreaterThan(550);

    await expect(await this.page.locator('.backdrop')).toBeHidden();
    await expect(await this.page.getByText('Are you still reading?')).toBeHidden();
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
    await this.page.clock.install({ time: await this.getIncrementedTime(60) });

    await this.page.clock.runFor('51:10'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // after 240sec, we expected to warning message having backdrop
    await this.warningModelVisible();

    await this.page.clock.runFor('10:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(await this.page.getByText('This book has been returned')).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async autoRenew_userJustBrowsedFor60MinRenewed() {
    await this.clickOnBrowsedButton();

    await this.page.clock.install({ time: await this.getIncrementedTime(60) });

    await this.page.clock.runFor('51:10'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // after 240sec, we expected to warning message having backdrop
    await this.warningModelVisible();

    await expect(await this.page.locator('#book-action-bar-custom-buttons')).toBeVisible();

    const keepReadingButton = await this.page.locator('#book-action-bar-custom-buttons button').first();
    if (keepReadingButton) {
      await keepReadingButton.click();
      await this.page.waitForTimeout(1000);
    }

    await expect(await this.page.locator('.backdrop')).toBeHidden();

    // timer has been reset and match with total loan seconds... :)
    await expect(await this.getTimerCountdownSeconds()).toBeGreaterThan(3000);

    await this.page.clock.runFor('10:00'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    await expect(await this.page.getByText('This book has been returned')).toBeHidden();
  }


  async autoRenew_autoRenew60MinWhenUserMakeActivity() {
    await this.clickOnBrowsedButton();
    await this.page.clock.install({ time: await this.getIncrementedTime(60) });

    await this.page.clock.runFor('45:10'); // (MM:SS)
    await this.page.waitForTimeout(1000);

    // user made activity on BookReader
    const pageChangedElement = await this.page.locator('.pageChangedEvent');
    if (pageChangedElement) {
      await pageChangedElement.click();
      await this.page.clock.runFor('04:10'); // (MM:SS)
      await this.page.waitForTimeout(7000);
    }

    // timer has been reset and match with total loan seconds... :)
    await expect(await this.getTimerCountdownSeconds()).toBeGreaterThan(3000);

    await expect(await this.page.locator('.backdrop')).toBeHidden();
    await expect(await this.page.getByText('Are you still reading?')).toBeHidden();
  }
}
