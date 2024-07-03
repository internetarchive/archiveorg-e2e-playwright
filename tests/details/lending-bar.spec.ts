import { test } from '../fixtures';

// test(`Load theater: bookreader with lending bar`, async ({ detailsPage, loginPage }) => {
//   await test.step('loan book with basic components', async () => {
//     await detailsPage.gotoPage('coleridgesublime0000char');
//     await detailsPage.lendingBar.verifyDefaultTexts();
//     await detailsPage.lendingBar.verifyInfoIcon();
//     await detailsPage.lendingBar.verifyLendingBarBasicNonLoggedIn();
//   });

//   await test.step('loan book with logged-in patron', async () => {
//     await loginPage.loginAs('patron');

//     await detailsPage.gotoPage('coleridgesublime0000char');
//     await detailsPage.lendingBar.verifyLendingBarLoggedIn();
//   });
// });


/**
 * auto-renew feature testing starts here.......
 */
test(`Lending-Bar with auto-renew for 5 minutes`, async ({ lendingBar }) => {
  const demoApp = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-73/?timer=5';

  await test.step('user browsed for 5min', async () => {
    await lendingBar.gotoPage(demoApp);
    await lendingBar.autoRenew_userJustBrowsedFor5Min();
  });

  await test.step('user browsed for 5min - renewed', async () => {
    await lendingBar.gotoPage(demoApp);
    await lendingBar.autoRenew_userJustBrowsedFor5MinRenewed();
  });
});

test(`Lending-Bar with auto-renew for 10 minutes`, async ({ lendingBar }) => {
  const demoApp = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-73/?timer=10';

  await test.step('user browsed for 10min', async () => {
    await lendingBar.gotoPage(demoApp);
    await lendingBar.autoRenew_userJustBrowsedFor10Min();
  });

  await test.step('user browsed for 10min - renewed', async () => {
    await lendingBar.gotoPage(demoApp);
    await lendingBar.autoRenew_userJustBrowsedFor10MinRenewed();
  });

  await test.step('user make activity to get silent renewed', async () => {
    await lendingBar.gotoPage(demoApp);
    await lendingBar.autoRenew_autoRenewWhenUserMakeActivity();
  });
});
