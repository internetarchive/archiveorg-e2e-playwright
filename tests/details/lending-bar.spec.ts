import { test } from '../fixtures';

test(`Load theater: bookreader with lending bar`, async ({ lendingBar, loginPage }) => {
  await test.step('loan book with basic components', async () => {
    await lendingBar.gotoPage('coleridgesublime0000char');
    await lendingBar.verifyDefaultTexts();
    await lendingBar.verifyInfoIcon();
    await lendingBar.verifyLendingBarBasicNonLoggedIn();
  });

  await test.step('loan book with logged-in patron', async () => {
    await loginPage.loginAs('patron');

    await lendingBar.gotoPage('coleridgesublime0000char');
    await lendingBar.verifyLendingBarLoggedIn();
  });
});
