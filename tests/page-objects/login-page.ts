import { type Page, Locator, expect } from '@playwright/test';

import { config } from '../../config';
import { UserType } from '../models';

export class LoginPageObject {
  readonly authTemplateLocator: Locator;

  readonly page: Page;

  public constructor(page: Page) {
    this.page = page;

    // TODO: Isn't this a settings-page object concern? Can we move?
    this.authTemplateLocator = this.page.locator('authentication-template');
  }

  /**
   * @param {UserType} user - Type of user to login as
   */
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

    const responsePromise = this.page.waitForResponse(response =>
      response.status() === 200)

    // TODO: Replace with named button locator
    await this.page.locator('input.btn.btn-primary.btn-submit').click();

    const response = await responsePromise;
    console.log('Login: Navigate to ', response.url())

    // TIP: Do specific checks in tests not page objects
    // should go back to baseUrl
    // await this.page.waitForURL('/');
  }

  async assertAccountSettingsDisplayed() {
    // TODO: Replace all waitForTimeout with web assertions
    await this.page.waitForTimeout(3000);

    // TODO: Move to test as not a "login" page object concern
    await this.page.goto('/account/index.php?settings=1');

    // TODO: Replace all waitForLoadState with web assertions
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });

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
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });

    await expect(this.authTemplate).not.toBeVisible();
    expect(
      await this.page.locator('#maincontent > div > div').innerText(),
    ).toContain('You must be logged in to change your settings');
  }
}
