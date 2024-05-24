import { test } from '../fixtures';

test.fixme(`Load theater: bookreader with lending bar`, async ({
  detailsPage,
  loginPage,
}) => {
  await test.step('loan book with basic components', async () => {
    await detailsPage.gotoPage('coleridgesublime0000char');
    await detailsPage.lendingBar.verifyDefaultTexts();
    await detailsPage.lendingBar.verifyInfoIcon();
    await detailsPage.lendingBar.verifyLendingBarBasicNonLoggedIn();
  });

  await test.step('loan book with logged-in patron', async () => {
    await loginPage.loginAs('patron');

    await detailsPage.gotoPage('coleridgesublime0000char');
    await detailsPage.lendingBar.verifyLendingBarLoggedIn();
  });
});
