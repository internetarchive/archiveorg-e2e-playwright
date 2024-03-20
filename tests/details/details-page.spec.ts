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

test(`Load theater: audio (image carousel / bookreader)`, async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage(
    '78_when-a-woman-loves-a-man_billie-holiday-and-her-orchestra-billie-holiday-buck-clayt_gbia0031202',
  );
  await detailsPage.verifyMusicTheaterDisplayWithCoverArt();
});

test(`Load theater: audio single image`, async ({ detailsPage }) => {
  await test.step('Load a page with single image', async () => {
    await detailsPage.gotoPage(
      '78_house-of-the-rising-sun_josh-white-and-his-guitar_gbia0001628b',
    );
    await detailsPage.verifyMusicTheaterDisplaySingleImage();
  });

  await test.step('Load another page with single image', async () => {
    await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles');
    await detailsPage.verifyMusicTheaterDisplaySingleImage();
  });
});

test(`Load theater: bookreader`, async ({ detailsPage }) => {
  await test.step('Load a book page', async () => {
    await detailsPage.gotoPage('goody');
    await detailsPage.verifyBookreaderDisplay();
  });

  await test.step('Load a book page with lending bar', async () => {
    await detailsPage.gotoPage('coleridgesublime0000char');
    await detailsPage.verifyBookreaderDisplay();
    await detailsPage.verifyLendingBarDisplay();
  });
});

test(`Load theater: data`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(
    'ARCHIVEIT-12737-DAILY-JOB1254458-SEED2061041-20200803-00000',
  );
  await detailsPage.verifyDataTheaterDisplay();
});

test(`Load theater: image (carousel)`, async ({ detailsPage }) => {
  // await detailsPage.gotoPage('ChannelLogos'); -> not working in playwright browser
  await detailsPage.gotoPage('img-0855_202106');
  await detailsPage.verifyImageCarouselTheaterDisplay(true);
});

test(`Load theater: image (single)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('mma_albert_einstein_270714');
  await detailsPage.verifyImageCarouselTheaterDisplay(false);
});

test(`Load theater: radio`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('WGBH_89_7_FM_20210918_040000');
  await detailsPage.verifyRadioPlayerTheaterDisplay();
});

test(`Load theater: tv`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('CSPAN3_20170413_154200_Discussion_Focuses_on_Sesame_Street_and_Autism');
});

test(`Load theater: video`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('0872_Angels_Flight_05_32_34_00');
  await detailsPage.verifyVideoPlayerTheaterDisplay();
});

test(`Load theater: webamp`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles');
  await detailsPage.iaMusicTheater.selectChannelSelector('Webamp');
});

test(`Load theater: webamp with skin`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('winampskin_Tundra_Winamp_Skin_Actualized');
});