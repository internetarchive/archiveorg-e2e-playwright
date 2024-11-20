import { test } from '../fixtures';

import { identifier } from '../../config';

test(`Load theater: bookreader with lending bar`, async ({ detailsPage, loginPage, browserName }) => {
  await test.step('loan book with basic components', async () => {
    await detailsPage.gotoPage(identifier.lending[browserName]);
    await detailsPage.lendingBar.verifyDefaultTexts();
    await detailsPage.lendingBar.verifyInfoIcon();
    await detailsPage.lendingBar.verifyLendingBarBasicNonLoggedIn();
  });

  await test.step('loan book with logged-in patron', async () => {
    await loginPage.loginAs('patron');

    await detailsPage.gotoPage(identifier.lending[browserName]);
    await detailsPage.lendingBar.verifyLendingBarLoggedIn();
  });
});
