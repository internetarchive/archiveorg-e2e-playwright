import { type Page, Locator, expect } from '@playwright/test';

/**
 * Objects representing the total loan time configurations for different durations.
 * Each object contains the following properties:
 * - `loanTotalTime`: Total time for the loan in seconds.
 * - `loanRenewAtLast`: Time after which the loan should be renewed in seconds.
 * - `pageChangedInLast`: Time after which the page changed event should be triggered in seconds.
 *
 * These objects are used in conjunction with the `clockConfig` to define specific loan behaviors.
 */

/**
 * Configuration for a 5-minute loan duration.
 * - `loanTotalTime`: 300 seconds (5 minutes).
 * - `loanRenewAtLast`: 240 seconds (4 minutes).
 * - `pageChangedInLast`: 60 seconds (1 minute).
 */

/**
 * Configuration for a 10-minute loan duration.
 * - `loanTotalTime`: 600 seconds (10 minutes).
 * - `loanRenewAtLast`: 480 seconds (8 minutes).
 * - `pageChangedInLast`: 120 seconds (2 minutes).
 */

/**
 * Configuration for a 1-hour loan duration.
 * - `loanTotalTime`: 3600 seconds (1 hour).
 * - `loanRenewAtLast`: 660 seconds (11 minutes).
 * - `pageChangedInLast`: 900 seconds (15 minutes).
 */

/**
 * Class representing the Lending Bar Auto Renew feature.
 */
export class LendingBarAutoRenew {
  readonly page: Page;

  readonly iaBookActions: Locator;
  readonly demoControls: Locator;

  private timeInBrowser: string;

  private clockConfig: object;

  /**
   * @param {Page} page - The Playwright page object.
   */
  public constructor(page: Page) {
    this.page = page;

    this.iaBookActions = this.page.locator('ia-book-actions');
    this.demoControls = this.page.locator('.initial');

    this.timeInBrowser = new Date().toISOString();

    /**
     * Configuration object for different loan durations and actions in the lending bar auto-renew feature.
     * This configuration is divided into two categories: 'keepReading' and 'pageFlip'.
     *
     * - `keepReading`: Configurations when the user is actively reading and wants to keep the loan.
     * - `pageFlip`: Configurations when the user flips the page, indicating activity.
     *
     * Each category contains configurations for different durations (5, 10, 60 minutes).
     * Each duration configuration includes the following properties:
     * - `warnAfter`: Time after which a warning is shown to the user (format: 'MM:SS').
     * - `wait`: Time the system waits after the warning before taking action (format: 'MM:SS').
     * - `expireAfter`: Total time after which the loan expires if no action is taken (format: 'MM:SS').
     *
     * Example usage:
     * const warnTime = this.clockConfig.keepReading[5].warnAfter; // Access the warn time for 5 minutes in keepReading
     */
    this.clockConfig = {
      keepReading: {
        5: { warnAfter: '01:10', wait: '00:07', expireAfter: '05:00' },
        10: { warnAfter: '02:10', wait: '00:07', expireAfter: '10:00' },
        60: { warnAfter: '51:10', wait: '00:07', expireAfter: '59:59' },
      },
      pageFlip: {
        5 : { flipBefore: '00:50', wait: '00:10', expireAfter: '05:00'},
        10 : { flipBefore: '01:40', wait: '00:30', expireAfter: '10:00'},
        60 : { flipBefore: '45:10', wait: '05:10', expireAfter: '59:59'},
      }
    };
  };

  /**
   * Auto renew feature testing based on different scenarios.
   * @param {number} minutes - The loan duration in minutes.
   * @param {string} scenario - The scenario for auto-renew testing.
   */
  async autoRenewTest(minutes: number, scenario: 'keepReading' | 'pageFlip') {
    const autoRenewFunctions = {
      keepReading: {
        5: this.autoRenewWhenClickOnKeepReadingBtn.bind(this, 5),
        10: this.autoRenewWhenClickOnKeepReadingBtn.bind(this, 10),
        60: this.autoRenewWhenClickOnKeepReadingBtn.bind(this, 60),
      },
      pageFlip: {
        5: this.autoRenewWhenUserFlipPage.bind(this, 5),
        10: this.autoRenewWhenUserFlipPage.bind(this, 10),
        60: this.autoRenewWhenUserFlipPage.bind(this, 60),
      },
    };

    const autoRenewFunction = autoRenewFunctions[scenario][minutes];

    if (autoRenewFunction) {
      await autoRenewFunction();
    } else {
      console.warn(`No auto-renew function defined for ${scenario} scenario with ${minutes} minutes.`);
    }
  }

  /**
   * Auto renew for a loan when the user has just browsed.
   * @param {number} minutes - The loan duration in minutes.
   */
  private async autoRenewWhenClickOnKeepReadingBtn(minutes: number) {
    await this.page.clock.install({ time: await this.getIncrementedTime(minutes) });
    await this.clickOnBrowsedButton();

    await this.runClockAndWaitForWarning(this.clockConfig['keepReading'][minutes].warnAfter);

    const keepReadingButton = this.page.getByText('Keep reading', { exact: true });
    if (await keepReadingButton.isVisible()) {
      await keepReadingButton.click();
      await this.setClockTimerAndWaitForStart('00:07');
    }

    await this.assertPopupHidden();
    const countdownSeconds = await this.getTimerCountdownSeconds();
    expect(countdownSeconds).toBeGreaterThanOrEqual(minutes * 60);

    await this.runClockAndWaitForLoanExpiration(this.clockConfig['keepReading'][minutes].expireAfter);
  }

  /**
   * Auto renew for a loan when the user makes activity.
   * @param {number} minutes - The loan duration in minutes.
   */
  private async autoRenewWhenUserFlipPage(minutes: number) {
    await this.page.clock.install({ time: await this.getIncrementedTime(minutes) });
    await this.clickOnBrowsedButton();

    await this.setClockTimerAndWaitForStart(this.clockConfig['pageFlip'][minutes].flipBefore);

    const pageChangedElement = this.page.locator('.pageChangedEvent');
    if (await pageChangedElement.isVisible()) {
      await pageChangedElement.click();
      await this.setClockTimerAndWaitForStart(this.clockConfig['pageFlip'][minutes].wait);
    }

    await this.assertPopupHidden();

    // TODO although, the loan get auto-renew silently when user trigger page changed event
    // but the timer counter values not being reset on demo pages URL.
    // so, later needs to un-comment the below lines...

    // const countdownSeconds = await this.getTimerCountdownSeconds();
    // expect(countdownSeconds).toBeGreaterThanOrEqual(minutes * 60);
  }

  /**
   * Click on the 'Browsed' button.
   */
  async clickOnBrowsedButton() {
    const userHasBrowsedCheckbox = this.demoControls.getByText('user_has_browsed', { exact: true });
    await userHasBrowsedCheckbox.click();
    await this.page.waitForTimeout(1000); // playwright wants to complete click event
  }

  /**
   * Get the countdown timer in seconds.
   * @returns {Promise<number | boolean>} The countdown timer in seconds or false if not found.
   */
  async getTimerCountdownSeconds(): Promise<number | boolean> {
    const timerElement = this.page.locator('timer-countdown .second');
    if (await timerElement.isVisible()) return Number(await timerElement.textContent());
    return false;
  }

  /**
   * Get the incremented time based on the specified minutes.
   * @param {number} minutes - The number of minutes to increment.
   * @returns {Promise<Date>} The incremented time.
   */
  async getIncrementedTime(minutes: number): Promise<Date> {
    const timeObj = new Date(this.timeInBrowser.toString());
    const incrementedTime = new Date(timeObj.getTime() + minutes * 60000);
    // console.log('timeInBrowser: ', this.timeInBrowser, ' incremented: ' ,incrementedTime);
    return incrementedTime;
  }

  /**
   * Check if the warning modal is visible.
   */
  async expectWarningModelVisible() {
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('Are you still reading?')).toBeVisible();
  }

  /**
   * Check if the expiration modal is visible.
   */
  async assertExpireModelVisible() {
    await expect(this.page.locator('.backdrop')).toBeVisible();
    await expect(this.page.getByText('This book has been returned due to inactivity.')).toBeVisible();
  }

  /**
   * Expect the warning modal to be hidden.
   */
  async assertWarningModelHidden() {
    await expect(this.page.locator('.backdrop')).toBeHidden();
    await expect(this.page.getByText('Are you still reading?')).toBeHidden();
  }

  /**
   * Expect any popup to be hidden.
   */
  async assertPopupHidden() {
    await expect(this.page.locator('.backdrop')).toBeHidden();
  }

  /**
   * Set clock specified timer and Wait for the clock to start.
   * @param {string} duration - The time duration.
   */
  async setClockTimerAndWaitForStart(duration: string) {
    await this.page.clock.fastForward(duration);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Run the clock and wait for the warning message.
   * @param {string} duration - The duration to run the clock.
   */
  async runClockAndWaitForWarning(duration: string) {
    await this.setClockTimerAndWaitForStart(duration);
    await this.expectWarningModelVisible();
  }

  /**
   * Run the clock and wait for loan expiration.
   * @param {string} duration - The duration to run the clock.
   */
  async runClockAndWaitForLoanExpiration(duration: string) {
    await this.setClockTimerAndWaitForStart(duration);
    await this.assertExpireModelVisible();
  }

  /**
   * Navigate to the specified page.
   * @param {string} uri - The URI of the page.
   */
  async gotoPage(uri: string) {
    await this.page.goto(uri);

    this.timeInBrowser = await this.page.evaluate(() => new Date().toISOString());

    await this.page.clock.setSystemTime(this.timeInBrowser.toString());
    await this.page.waitForTimeout(1000);
  }
}
