import { test } from '../fixtures';

test('Login as a patron', async ({ patronLoginPage }) => {
  await test.step('Check account settings page after logging in, and verify Account Settings page displayed', async () => {
    await patronLoginPage.assertAccountSettingsDisplayed();
  });
});

test('Login as a admin', async ({ privsLoginPage }) => {
  await test.step('Check account settings page after logging in, and verify Account Settings page displayed', async () => {
    await privsLoginPage.assertAccountSettingsDisplayed();
  });
});

test('Not logged in', async ({ loginPage }) => {
  await loginPage.notLoggedIn();
});
