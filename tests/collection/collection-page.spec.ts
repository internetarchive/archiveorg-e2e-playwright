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
  page,
  collectionPage,
}) => {
  await test.step(`Go to "ytjdradio" collection page`, async () => {
    await page.goto('/details/ytjdradio');
  });

  await test.step(`Click the "More..." link and check if About page is displayed`, async () => {
    await collectionPage.clickMoreBtnFromSummary();
    await collectionPage.validateAboutTabPage();
  });
});

test.fixme(`Tab navigation`, async ({ collectionPage }) => {
  await test.step(`Click "About" tab button and check if About page is displayed in "oldtimeradio" collection page`, async () => {
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
