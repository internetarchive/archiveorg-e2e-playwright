import { test } from '@playwright/test';

import { ProfilePage } from '../page-objects/profile-page';
import { SearchFacetGroupHeaderNames } from '../models';

import { testBeforeEachConfig } from '../../config';

let profilePage: ProfilePage;

test.beforeEach(async ({ context }) => {
  await testBeforeEachConfig(context);
});

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
    await test.step(`Check if correct profile tabs are displayed for guest user`, async () => {
      await profilePage.validateUnownedProfilePageTabs();
    });
  });

  test(`Tab navigation: Click the different tabs on profile page`, async () => {
    await test.step(`Go to brewster's profile page`, async () => {
      await profilePage.visit('brewster');
    });

    await test.step(`Click "Uploads" tab and check if Uploads tab/page is displayed`, async () => {
      await profilePage.clickProfileTab('uploads');
      await profilePage.validateClickedTabAppeared('uploads');
      await profilePage.validateResultCountElement('uploads');
    });

    await test.step(`Click "Lists" tab and check if tab/page is displayed`, async () => {
      await profilePage.clickProfileTab('lists');
      await profilePage.validateClickedTabAppeared('lists');
    });

    await test.step(`Click "Posts" tab and check if tab/page is displayed`, async () => {
      await profilePage.clickProfileTab('posts');
      await profilePage.validateClickedTabAppeared('posts');
      await profilePage.validateResultForPostsTab();
    });

    await test.step(`Click "Reviews" tab and check if tab/page is displayed`, async () => {
      await profilePage.clickProfileTab('reviews');
      await profilePage.validateClickedTabAppeared('reviews');
      await profilePage.validateResultCountElement('reviews');
    });

    await test.step(`Click "Collections" tab and check if tab/page is displayed`, async () => {
      await profilePage.clickProfileTab('collections');
      await profilePage.validateClickedTabAppeared('collections');
      await profilePage.validateResultCountElement('collections');
    });

    await test.step(`Click "Web Archives" tab and check if tab/page is displayed`, async () => {
      await profilePage.clickProfileTab('web archives');
      await profilePage.validateClickedTabAppeared('web-archive');
      await profilePage.validateResultCountElement('web-archive');
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
      await profilePage.collectionFacets.assertFacetGroupCount(
        'search',
        SearchFacetGroupHeaderNames,
      );
    });

    await test.step(`Date picker appears`, async () => {
      await profilePage.validateDatePickerIsVisible();
    });
  });
});

test.afterAll(async () => {
  await profilePage.page.close();
});
