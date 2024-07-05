import { test } from '../fixtures';

/**
 * auto-renew feature testing starts here.......
 */
test(`Lending-Bar with auto-renew for 5 minutes`, async ({ lendingBarAutoRenew }) => {
  const demoApp = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-73/?timer=5';

  await test.step('user browsed for 5min', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_userJustBrowsedFor5Min();
  });

  await test.step('user browsed for 5min - renewed', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_userJustBrowsedFor5MinRenewed();
  });
});

test(`Lending-Bar with auto-renew for 10 minutes`, async ({ lendingBarAutoRenew }) => {
  const demoApp = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-73/?timer=10';

  await test.step('user browsed for 10min', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_userJustBrowsedFor10Min();
  });

  await test.step('user browsed for 10min - renewed', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_userJustBrowsedFor10MinRenewed();
  });

  await test.step('user make activity to get silent renewed', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_autoRenewWhenUserMakeActivity();
  });
});

test(`Lending-Bar with auto-renew for 60 minutes`, async ({ lendingBarAutoRenew }) => {
  const demoApp = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-73/?timer=60';

  await test.step('user browsed for 60min', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_userJustBrowsedFor60Min();
  });

  await test.step('user browsed for 60min - renewed', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_userJustBrowsedFor60MinRenewed();
  });

  await test.step('user make activity to get silent renewed', async () => {
    await lendingBarAutoRenew.gotoPage(demoApp);
    await lendingBarAutoRenew.autoRenew_autoRenew60MinWhenUserMakeActivity();
  });
});
