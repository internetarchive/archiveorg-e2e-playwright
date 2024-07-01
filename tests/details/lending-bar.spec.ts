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
test(`Lending-Bar with auto-renew feature...`, async ({ lendingBar }) => {
  await test.step('without logged-in', async () => {
    const demoApp = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-72/';
    await lendingBar.gotoPage(demoApp);

    // await lendingBar.autoRenew_verifyDefaultTexts();

    await lendingBar.autoRenew_userJustBrowsed();
    // await lendingBar.autoRenew_userHasBrowsed();
  });
});
