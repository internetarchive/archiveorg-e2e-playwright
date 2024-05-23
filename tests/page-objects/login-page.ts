import { type Page, Locator, expect } from '@playwright/test';

import { config } from '../../config';
import { UserType } from '../models';

export class LoginPage {
  readonly authTemplate: Locator;

  readonly page: Page;

  public constructor(page: Page) {
    this.page = page;

    this.authTemplate = this.page.locator('authentication-template');
  }

  async loginAs(user: UserType) {
    const asUser = user === 'privs' ? config.privUser : config.patronUser;

    await this.page.goto('/account/login');
    await this.page.fill(
      'input.form-element.input-email[type=email]',
      asUser.email,
    );
    await this.page.fill(
      'input.form-element.input-password[type=password]',
      asUser.password,
    );
    await this.page.locator('input.btn.btn-primary.btn-submit').click();
    /* NOTE: We almost never want to use waitForTimeout() in tests
     *       This adds an EXTRA delay that can make tests flaky
     */
    // await this.page.waitForTimeout(10000);

    /* NOTE: This URL check seems to fail
     * Waiting for the response seems a temporary fix
     * We should:
     * 1. wait for the page to load
     * 2. Have a check for user facing elements like user menu
     */
    // should go back to baseUrl
    // await this.page.waitForURL('/');

    await this.page.waitForResponse(response => response.status() === 200);
  }

  async assertAccountSettingsDisplayed() {
    /* NOTE: We almost never want to use waitForTimeout() in tests
     */
    //await this.page.waitForTimeout(3000);

    await this.page.goto('/account/index.php?settings=1');
    /* NOTE: We almost never want to use waitForLoadState('networkidle'...
     */
    // await this.page.waitForLoadState('networkidle', { timeout: 60000 });

    await expect(this.authTemplate).toBeVisible();

    expect(
      await this.authTemplate
        .locator('div.form-element')
        .first()
        .locator('h2')
        .innerText(),
    ).toBe('Account settings');

    expect(await this.authTemplate.locator('form > p').innerText()).toBe(
      'Please verify your password to access account settings.',
    );

    expect(
      await this.authTemplate
        .locator('div.form-element')
        .last()
        .locator('button')
        .innerText(),
    ).toBe('Verify password');
  }

  async notLoggedIn() {
    await this.page.goto('/account/index.php?settings=1');
    /* NOTE: We almost never want to use waitForLoadState('networkidle'...
     */
    // await this.page.waitForLoadState('networkidle', { timeout: 60000 });

    await expect(this.authTemplate).not.toBeVisible();
    expect(
      await this.page.locator('#maincontent > div > div').innerText(),
    ).toContain('You must be logged in to change your settings');
  }
}
