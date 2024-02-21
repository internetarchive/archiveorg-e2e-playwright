import { test, expect } from '@playwright/test';

test('page load - check login page fields elements', async ({ page }) => {
  await page.goto('/account/login');
  await expect(page).toHaveURL(/login/);

  const boxRow = page.locator('.box.row');
  const loginFormElement = boxRow.locator('.login-form-element');
  const formLoginFields = loginFormElement.locator('.iaform.login-form');
  const inputEmail = loginFormElement.locator('.form-element.input-email');
  const inputPassword = loginFormElement.locator(
    '.form-element.input-password',
  );
  const btnLogin = loginFormElement.locator(
    '.btn.btn-primary.btn-submit.input-submit.js-submit-login',
  );

  await expect(loginFormElement).toBeVisible({ timeout: 30000 });
  await expect(inputEmail).toBeVisible({ timeout: 30000 });
  await expect(formLoginFields).toBeVisible({ timeout: 30000 });
  await expect(inputPassword).toBeVisible({ timeout: 30000 });
  await expect(btnLogin).toBeVisible({ timeout: 30000 });
});
