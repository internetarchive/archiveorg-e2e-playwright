import { test } from '@playwright/test';

import { ProfilePage } from '../page-objects/profile-page';

let profilePage: ProfilePage;

test.describe('Profile Page - Basic display tests', () => {
  test.describe.configure({ mode: 'serial' });

  test(`Profiles use profile page layout`, async ({ browser }) => {
    const browserPage = await browser.newPage();
    profilePage = new ProfilePage(browserPage);

    await test.step(`Go to @brewster's profile`, async () => {
      await profilePage.visit('brewster');
    });

    await test.step(`Check if profile avatar, summary and action bar appear`, async () => {
      await profilePage.validatePageHeaderElements();
    });

    await test.step(`Check if profile tabs are displayed`, async () => {
      await profilePage.validateUnownedProfilePageTabs();
    });
  });
});

test.afterAll(async () => {
  await profilePage.page.close();
});
