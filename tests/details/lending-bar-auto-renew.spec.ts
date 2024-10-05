import { test } from '../fixtures';

/*
 * TODO: later we'll run these tests againsts production URL when auto-renew is moved to live.
 */
const DEMO_APP_BASE_URL = 'https://internetarchive.github.io/iaux-book-actions/pr/pr-74/';

// Helper function to construct demo app URL with timer
const getDemoAppUrl = (timer: number) => `${DEMO_APP_BASE_URL}?timer=${timer}`;

// loan durations in minutes
const loanDurations = [5, 10, 60];

test.skip(`Lending-Bar: auto-renew when user click "Keep Reading" button`, async ({ lendingBarAutoRenew }) => {
  for (const loanDuration of loanDurations) {
    await test.step(`${loanDuration} minutes loan`, async () => {
      await lendingBarAutoRenew.gotoPage(getDemoAppUrl(loanDuration));
      await lendingBarAutoRenew.autoRenewTest(loanDuration, 'keepReading');
    });
  }
});

test.skip(`Lending-Bar: auto-renew when user flip bookreader page`, async ( { lendingBarAutoRenew } ) => {
  for (const loanDuration of loanDurations) {
    await test.step(`${loanDuration} minutes loan`, async () => {
      await lendingBarAutoRenew.gotoPage(getDemoAppUrl(loanDuration));
      await lendingBarAutoRenew.autoRenewTest(loanDuration, 'pageFlip');
    });
  }
});
