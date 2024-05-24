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
    await this.page.waitForResponse(response => response.status() === 200);
    // TODO: fix load session after logging in to pass in next page
    // adding timeout fixes it for now
    await this.page.waitForTimeout(3000);
  }

  async assertAccountSettingsDisplayed() {
    await this.page.goto('/account/index.php?settings=1');
    // await this.page.waitForLoadState('domcontentloaded');
    // to fix, authTemplate element not found
    // await expect(this.authTemplate).toBeVisible();

    // expect(
    //   await this.authTemplate
    //     .locator('div.form-element')
    //     .first()
    //     .locator('h2')
    //     .innerText(),
    // ).toBe('Account settings');

    await expect(
      this.page.getByRole('heading', { name: 'Account settings' }),
    ).toBeVisible();

    await expect(
      this.page.getByText(
        'Please verify your password to access account settings.',
      ),
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', { name: 'Verify password' }),
    ).toBeVisible();

    // expect(await this.authTemplate.locator('form > p').innerText()).toBe(
    //   'Please verify your password to access account settings.',
    // );

    // expect(
    //   await this.authTemplate
    //     .locator('div.form-element')
    //     .last()
    //     .locator('button')
    //     .innerText(),
    // ).toBe('Verify password');
  }

  async notLoggedIn() {
    await this.page.goto('/account/index.php?settings=1');
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByText('You must be logged in to')).toBeVisible();
  }
}
