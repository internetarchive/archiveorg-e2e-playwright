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

test(`Load theater: image (carousel)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('78_when-a-woman-loves-a-man_billie-holiday-and-her-orchestra-billie-holiday-buck-clayt_gbia0031202');
});

test(`Load theater: audio single image`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('78_house-of-the-rising-sun_josh-white-and-his-guitar_gbia0001628b');

  await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles')
});

test(`Load theater: bookreader`, async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage('goody');
  await detailsPage.verifyBookreaderDisplay();
  await detailsPage.gotoPage('coleridgesublime0000char');
  await detailsPage.verifyBookreaderDisplay();
  await detailsPage.verifyLendingBarDisplay();
});

