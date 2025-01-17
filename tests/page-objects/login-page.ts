import { type Page, Locator, expect } from '@playwright/test';

import { config, identifier } from '../../config';
import { UserType } from '../models';

const { accountSettings, login } = identifier;
export class LoginPage {
  readonly authTemplate: Locator;

  readonly page: Page;

  public constructor(page: Page) {
    this.page = page;

    this.authTemplate = this.page.locator('authentication-template');
  }

  async loginAs(user: UserType) {
    const asUser = user === 'privs' ? config.privUser : config.patronUser;

    await this.page.goto(login.url);
    await this.page.fill(
      'input.form-element.input-email[type=email]',
      asUser.email,
    );
    await this.page.fill(
      'input.form-element.input-password[type=password]',
      asUser.password,
    );
    await this.page.locator('input.btn.btn-primary.btn-submit').click();

    // should go back to baseUrl
    await this.page.waitForURL('/');
  }

  async assertAccountSettingsDisplayed() {
    await this.page.goto(accountSettings.url);
    await this.page.waitForURL(/settings=1/);

    await expect(this.authTemplate).toBeVisible();

    expect(
      await this.authTemplate
        .locator('div.form-element')
        .first()
        .locator('h2')
        .innerText(),
    ).toBe('Account settings');

    expect(await this.authTemplate.locator('form > p').innerText()).toBe(
      'To access your account settings, as an extra security measure, please enter your password.',
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
    await this.page.goto(accountSettings.url);
    await this.page.waitForURL(/settings=1/);

    await expect(this.authTemplate).not.toBeVisible();
    expect(
      await this.page.locator('#maincontent > div > div').innerText(),
    ).toContain('You must be logged in to change your settings');
  }
}
