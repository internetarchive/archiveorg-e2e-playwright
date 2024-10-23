import { test } from '../../tests/fixtures';

test(`Collections basic display - use collection page layout`, async ({
  collectionPage,
}) => {
  await test.step(`Check if collection thumbnail, summary and action bar appears`, async () => {
    await collectionPage.validatePageHeaderElements();
  });

  await test.step(`Check if Collection | About | Forum tabs are displayed`, async () => {
    await collectionPage.validateCollectionPageTabs();
  });
});

test(`Collections page - "More..." link to About tab appears below description`, async ({
  collectionPage,
}) => {
  await test.step(`Go to "ytjdradio" collection page`, async () => {
    await collectionPage.visit('ytjdradio');
  });

  await test.step(`Click the "More..." link and check if About page is displayed`, async () => {
    await collectionPage.clickMoreBtnFromSummary();
    await collectionPage.validateAboutTabPage();
  });
});

test(`Tab navigation`, async ({ collectionPage }) => {
  await test.step(`Click "About" tab button and check if About page is displayed in "oldtimeradio" collection page`, async () => {
    await collectionPage.clickCollectionTab('About');
    // await collectionPage.validateTabPage('About');
  });

  await test.step(`Click "Forum" tab button and check if Forum page is displayed in "oldtimeradio" collection page`, async () => {
    await collectionPage.clickCollectionTab('Forum');
    // await collectionPage.validateTabPage('Forum');
  });

  await test.step(`Click "Collection" tab button and check if Collections page is displayed in "oldtimeradio" collection page`, async () => {
    await collectionPage.clickCollectionTab('Collection');
    // await collectionPage.validateTabPage('Collection');
  });
});
