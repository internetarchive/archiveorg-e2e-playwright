import { test } from '../fixtures';

// TODO: DO test separation setup
// TODO: DO test separation teardown

test('Account settings - Login as a patron', async ({ patronLoginPage }) => {
  await test.step('Check account settings page after logging in, and verify Account Settings page displayed', async () => {
    await patronLoginPage.assertAccountSettingsDisplayed();
  });
});

test('Account settings - Login as a admin', async ({ privsLoginPage }) => {
  await test.step('Check account settings page after logging in, and verify Account Settings page displayed', async () => {
    await privsLoginPage.assertAccountSettingsDisplayed();
  });
});

test('Account settings - Not logged in', async ({ loginPage }) => {
  await loginPage.notLoggedIn();
});
