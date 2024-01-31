import { test, expect } from '@playwright/test';

test('page load - check login page fields elements', async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto('https://archive.org/account/login');
  await expect(page).toHaveURL(/login/);

  const boxRow = page.locator('.box.row');
  const loginFormElement = boxRow.locator('.login-form-element');
  const formLoginFields = loginFormElement.locator('.iaform.login-form');
  const inputEmail = loginFormElement.locator('.form-element.input-email');
  const inputPassword = loginFormElement.locator('.form-element.input-password');
  const btnLogin = loginFormElement.locator(
    '.btn.btn-primary.btn-submit.input-submit.js-submit-login'
  );

  expect(await loginFormElement.count()).toEqual(1);
  expect(await inputEmail.count()).toEqual(1);
  expect(await formLoginFields.count()).toEqual(1);
  expect(await inputPassword.count()).toEqual(1);
  expect(await btnLogin.count()).toEqual(1);
});
