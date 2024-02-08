import { test } from '@playwright/test';

import { CollectionPage } from '../page-objects/collection-page';

let collectionPage: CollectionPage;

test.afterAll(async () => {
  await collectionPage.page.close();
});

test.describe('Collection Page - Basic display tests', () => {
  test.describe.configure({ mode: 'serial' });

  test(`Collections use collection page layout`, async ({ browser }) => {
    const browserPage = await browser.newPage();
    collectionPage = new CollectionPage(browserPage);

    await test.step(`Go to "oldtimeradio" collection page`, async () => {
      await collectionPage.visit('oldtimeradio');
    });

    await test.step(`Check if collection thumbnail, summary and action bar appears`, async () => {
      await collectionPage.validatePageHeaderElements();
    });

    await test.step(`Check if Collection | About | Forum tabs are displayed`, async () => {
      await collectionPage.validateCollectionPageTabs();
    });
  });

  test(`"More..." link to About tab appears below description`, async () => {
    await test.step(`Go to "ytjdradio" collection page`, async () => {
      await collectionPage.visit('ytjdradio');
    });

    await test.step(`Click the "More..." link and check if About page is displayed`, async () => {
      await collectionPage.clickMoreBtnFromSummary();
      await collectionPage.validateAboutTabPage();
    });
  });

  test(`Tab navigation`, async () => {
    await test.step(`Navigate to "oldtimeradio" collection page`, async () => {
      await collectionPage.visit('oldtimeradio');
    });

    await test.step(`Click "About" tab button and check if About page is displayed`, async () => {
      await collectionPage.clickCollectionTab('About');
      await collectionPage.validateAboutTabPage();
    });

    await test.step(`Click "Forum" tab button and check if Forum page is displayed`, async () => {
      await collectionPage.clickCollectionTab('Forum');
      await collectionPage.validateForumTabPage();
    });

    await test.step(`Click "Collection" tab button and check if Collections page is displayed`, async () => {
      await collectionPage.clickCollectionTab('Collection');
      await collectionPage.validateCollectionTabPage();
    });
  });
});
