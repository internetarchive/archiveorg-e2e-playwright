import { test } from '../fixtures';

test.fixme(
  'Account settings - Login as a patron',
  async ({ patronLoginPage }) => {
    await test.step('Check account settings page after logging in, and verify Account Settings page displayed', async () => {
      await patronLoginPage.assertAccountSettingsDisplayed();
    });
  },
);

test.fixme(
  'Account settings - Login as a admin',
  async ({ privsLoginPage }) => {
    await test.step('Check account settings page after logging in, and verify Account Settings page displayed', async () => {
      await privsLoginPage.assertAccountSettingsDisplayed();
    });
  },
);

test('Account settings - Not logged in', async ({ loginPage }) => {
  await loginPage.notLoggedIn();
});
