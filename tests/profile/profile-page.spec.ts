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

test.describe('Profile Page - Lists', () => {
  test.describe.configure({ mode: 'serial' });

  test(`Facets appear`, async ({ browser }) => {
    const browserPage = await browser.newPage();
    profilePage = new ProfilePage(browserPage);

    await test.step(`Go to @robertkeizer profile`, async () => {
      await profilePage.visit('robertkeizer');
    });

    await test.step(`Navigate to lists tab`, async () => {
      await profilePage.clickProfileTab('lists');
    });

    await test.step(`7 facet groups appear`, async () => {
      await profilePage.collectionFacets.assertListFacetGroupCount();
    });

    await test.step(`Date picker appears`, async () => {
      await profilePage.validateDatePickerIsVisible();
    });
  });

});

test.afterAll(async () => {
  await profilePage.page.close();
});
