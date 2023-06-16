import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test('login page regular privs', async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto('https://archive.org/account/login');
  await expect(page).toHaveURL(/login/);

  const boxRow = page.locator('.box.row');
  const loginFormElement = boxRow.locator('.login-form-element');
  const formLoginFields = loginFormElement.locator('.iaform.login-form');
  const inputEmail = loginFormElement.locator('.form-element.input-email');
  const inputPassword = loginFormElement.locator('.form-element.input-password');
  const btnLogin = loginFormElement.locator('.btn.btn-primary.btn-submit.input-submit.js-submit-login');

  expect(await loginFormElement.count()).toEqual(1);
  expect(await inputEmail.count()).toEqual(1);
  expect(await formLoginFields.count()).toEqual(1);
  expect(await inputPassword.count()).toEqual(1);
  expect(await btnLogin.count()).toEqual(1);

  // fill-up form
  await inputEmail.click();
  await inputEmail.fill(process.env.B_EMAIL || '');
  await inputPassword.click();
  await inputPassword.fill(process.env.B_PASSWORD || '');
  await btnLogin.click();

  await page.waitForTimeout(3000);
  await page.waitForURL('https://archive.org');
  // TODO: fix identify components for regular user
  // await page.goto('https://archive.org/details/bdrc-W1PD137788');
  // await page.waitForTimeout(3000);

  // const iaBookTheater = page.locator('ia-book-theater.focus-on-child-only');
  // const iaBookWrapper = iaBookTheater.locator('#IABookReaderMessageWrapper');
  // const iaBookActions = iaBookWrapper.locator('ia-book-actions');

  // expect(await iaBookTheater.count()).toEqual(1);
  // expect(await iaBookWrapper.count()).toEqual(1);
  // expect(await iaBookActions.count()).toEqual(1);

  // const collapsibleActionGroup = iaBookActions.locator('collapsible-action-group');
  // expect(await collapsibleActionGroup.count()).toEqual(1);

  // const btnBorrow = collapsibleActionGroup.getByRole('button', { name: 'Borrow for 1 hour' });;
  // const btnAdminAccess = collapsibleActionGroup.getByRole('link', { name: 'Admin Access' });;

  // expect(await btnBorrow.count()).toEqual(1);
  // expect(await btnAdminAccess.count()).toEqual(0);
});
