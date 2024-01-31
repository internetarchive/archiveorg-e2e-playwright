import { test } from '@playwright/test';

import { CollectionPage } from '../pageObjects/collection-page';

let collectionPage: CollectionPage;

test.describe('Collection Page - Basic display tests', () => {
  test.describe.configure({ mode: 'serial' });

  test(`Collections use collection page layout`, async ({ browser }) => {
    const browserPage = await browser.newPage();
    collectionPage = new CollectionPage(browserPage);

    await test.step(`Go to "oldtimeradio" collection page`, async () => {
      await collectionPage.visit('oldtimeradio');
    });

    await test.step(`Check if collection thumbnail appears`, async () => {
      await collectionPage.checkCollectionThumbnail();
    });

    await test.step(`Check if collection summary appears`, async () => {
      await collectionPage.checkCollectionSummary();
    });

    await test.step(`Check if Action bar appears`, async () => {
      await collectionPage.checkCollectionActionBar();
    });

    await test.step(`Check if Collection | About | Forum tabs are displayed`, async () => {
      await collectionPage.checkCollectionPageTabs();
    });
  });

  test(`"More..." link to About tab appears below description`, async () => {
    await test.step(`Go to "ytjdradio" collection page`, async () => {
      await collectionPage.visit('ytjdradio');
    });

    await test.step(`Click the "More..." link (below description)`, async () => {
      await collectionPage.clickMoreBtnFromSummary();
    });

    await test.step(`Check if page is pointing to About tab`, async () => {
      await collectionPage.checkAboutTabPage();
    });
  });

  test(`Tab navigation`, async () => {
    await test.step(`Navigate to "oldtimeradio" collection page`, async () => {
      await collectionPage.visit('oldtimeradio');
    });

    await test.step(`Click "About" tab button`, async () => {
      await collectionPage.clickCollectionTab('About');
    });

    await test.step(`Check if page is pointing to About tab`, async () => {
      await collectionPage.checkAboutTabPage();
    });

    await test.step(`Click "Forum" tab button`, async () => {
      await collectionPage.clickCollectionTab('Forum');
    });

    await test.step(`Check if page is pointing to Forum tab`, async () => {
      await collectionPage.checkForumTabPage();
    });

    await test.step(`Click "Collection" tab button`, async () => {
      await collectionPage.clickCollectionTab('Collection');
    });

    await test.step(`Check if page is pointing to Collection tab`, async () => {
      await collectionPage.checkCollectionTabPage();
    });
  });

  test('Close browser after all tests', async () => {
    await collectionPage.page.close();
  });
});
