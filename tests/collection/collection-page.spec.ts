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

  test.skip(``, async () => {
    await test.step(``, async () => {
      // TODO:
    });

    await test.step(``, async () => {
      // TODO
    });

    await test.step(``, async () => {
      // TODO
    });
  });

  test('Close browser after all tests', async () => {
    await collectionPage.page.close();
  })

})
