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
  await test.step('Load a page with single image', async () => {
    await detailsPage.gotoPage(
      '78_house-of-the-rising-sun_josh-white-and-his-guitar_gbia0001628b',
    );
    await detailsPage.verifyMusicTheaterDisplaySingleImage();
  })

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
  })
});

test(`Load theater: data`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(
    'ARCHIVEIT-12737-DAILY-JOB1254458-SEED2061041-20200803-00000',
  );
  await detailsPage.verifyDataTheaterDisplay();
});

test(`Load theater: image (carousel)`, async ({ detailsPage }) => {
  // await detailsPage.gotoPage('ChannelLogos');
  await detailsPage.gotoPage('img-0855_202106');
  await detailsPage.verifyImageCarouselTheaterDisplay(true);
});

test(`Load theater: image (single)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('mma_albert_einstein_270714');
  await detailsPage.verifyImageCarouselTheaterDisplay(false);
});
