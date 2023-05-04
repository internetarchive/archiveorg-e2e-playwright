import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

test('login page', async ({ page }) => {
  // await page.goto('https://archive.org/account/login');

  // await expect(page).toHaveURL(/login/);

  // const boxRow = page.locator('.box.row');
  // expect(await boxRow.count()).toEqual(1);

  // const loginHeader = boxRow.locator('.login-header');
  // expect(await loginHeader.count()).toEqual(1);

  // const errorCookie = boxRow.locator('.error.cookie-warning.hidden');
  // expect(await errorCookie.count()).toEqual(1);

  // const googleLogin = boxRow.locator('.third-party-sso')
  // expect(await googleLogin.count()).toEqual(1);

  // const loginFormElement = boxRow.locator('.login-form-element');
  // expect(await loginFormElement.count()).toEqual(1);

  // const formLoginFields = loginFormElement.locator('.iaform.login-form');
  // expect(await formLoginFields.count()).toEqual(1);

  // const inputEmail = loginFormElement.locator('.form-element.input-email');
  // expect(await inputEmail.count()).toEqual(1);

  // const inputPassword = loginFormElement.locator('.form-element.input-password');
  // expect(await inputPassword.count()).toEqual(1);

  // const btnLogin = loginFormElement.locator('.btn.btn-primary.btn-submit.input-submit.js-submit-login')
  // expect(await btnLogin.count()).toEqual(1);

  // // fill-up form - with admin privs
  // await inputEmail.click();
  // await inputEmail.fill(process.env.EMAIL || '');
  // await inputPassword.click();
  // await inputPassword.fill(process.env.PASSWORD || '');
  // await btnLogin.click();
  
  // await page.waitForURL('https://archive.org/');
  await page.goto('https://archive.org/details/bdrc-W1PD137788?transpiled=1');

  const iaBookTheater = page.locator('ia-book-theater');
  const iaBookWrapper = iaBookTheater.locator('#IABookReaderMessageWrapper');
  const iaLendingWrapper = iaBookTheater.locator('.lending-wrapper')
  // const iaBookActions = iaBookWrapper.locator('ia-book-actions.focus-on-child-only');
  expect(await iaBookTheater.count()).toEqual(1);
  expect(await iaBookWrapper.count()).toEqual(1);
  expect(await iaLendingWrapper.count()).toEqual(1);

  const collapsibleActionGroup = iaBookWrapper.locator('collapsible-action-group');
  expect(await collapsibleActionGroup.count()).toEqual(1);

  const actionGroup = collapsibleActionGroup.locator(' actiongroup ');
  const actionGroupPrimary = collapsibleActionGroup.locator('.action-buttons.primary');
  const actionGroupSecondary = collapsibleActionGroup.locator('.action-buttons.secondary');
  expect(await actionGroup.count()).toEqual(1);
  expect(await actionGroupPrimary.count()).toEqual(1);
  expect(await actionGroupSecondary.count()).toEqual(1);

});

