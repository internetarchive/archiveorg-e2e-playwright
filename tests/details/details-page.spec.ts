import { test } from '../fixtures';

test('Items display item details page', async ({ detailsPage }) => {
  await detailsPage.gotoPage('goody');

  await detailsPage.assertPageElements();
});

//
test('Load theater: 3d viewer', async ({ detailsPage }) => {
  await detailsPage.gotoPage('smarthouseplus-v1.0');
  await detailsPage.verify3dTheaterDisplay();
});

test(`Load theater: audio (image carousel / bookreader)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(
    '78_when-a-woman-loves-a-man_billie-holiday-and-her-orchestra-billie-holiday-buck-clayt_gbia0031202',
  );
  await detailsPage.verifyMusicTheaterDisplayWithCoverArt();
});

test(`Load theater: audio single image`, async ({ detailsPage }) => {
  await test.step('Load a page without a cover art - just placeholder', async () => {
    await detailsPage.gotoPage(
      '78_house-of-the-rising-sun_josh-white-and-his-guitar_gbia0001628b',
    );
    await detailsPage.iaMusicTheater.placeholderImageDisplay(true);
  })

  await test.step('Load another page with image cover art', async () => {
    await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles');
    await detailsPage.iaMusicTheater.placeholderImageDisplay(false);
    await detailsPage.verifyMusicTheaterDisplayWithCoverArt();
  });
});

test(`Load theater: bookreader`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('goody');
  await detailsPage.verifyBookreaderDisplay();
  await detailsPage.gotoPage('coleridgesublime0000char');
  await detailsPage.verifyBookreaderDisplay();
  await detailsPage.verifyLendingBarDisplay();
});
