import { test } from '../fixtures';

test('Basic display: Items display item details page', async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage('goody');
  await detailsPage.assertPageElements();
});

test('Load theater: 3d viewer', async ({ detailsPage }) => {
  await detailsPage.gotoPage('smarthouseplus-v1.0');
  await detailsPage.container3dDisplay();
});

test(`Load theater: audio (image carousel / bookreader)`, async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage(
    '78_when-a-woman-loves-a-man_billie-holiday-and-her-orchestra-billie-holiday-buck-clayt_gbia0031202',
  );
  await detailsPage.musicTheaterDisplayWithCoverArt();
});

test(`Load theater: audio single image`, async ({ detailsPage }) => {
  await test.step('Load a page with single image', async () => {
    await detailsPage.gotoPage(
      '78_house-of-the-rising-sun_josh-white-and-his-guitar_gbia0001628b',
    );
    await detailsPage.musicTheaterDisplaySingleImage();
  });

  await test.step('Load another page with single image', async () => {
    await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles');
    await detailsPage.musicTheaterDisplaySingleImage();
  });
});

test(`Load theater: bookreader`, async ({ detailsPage }) => {
  await test.step('Load a book page', async () => {
    await detailsPage.gotoPage('goody');
    await detailsPage.bookreaderDisplay();
  });

  await test.step('Load a book page with lending bar', async () => {
    await detailsPage.gotoPage('coleridgesublime0000char');
    await detailsPage.bookreaderDisplay();
    await detailsPage.lendingBarDisplay();
  });
});

test(`Load theater: data`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(
    'ARCHIVEIT-12737-DAILY-JOB1254458-SEED2061041-20200803-00000',
  );
  await detailsPage.dataTheaterDisplay();
});

test(`Load theater: software emulation`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('msdos_Oregon_Trail_The_1990');
  await detailsPage.softwareEmulationTheaterDisplay();
});

test(`Load theater: image (carousel)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('img-0855_202106');
  await detailsPage.imageCarouselMultipleImageDisplay(true);
});

test(`Load theater: image (single)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('mma_albert_einstein_270714');
  await detailsPage.imageCarouselMultipleImageDisplay(false);
});

test(`Load theater: radio as priv'd user`, async ({
  loginPage,
  detailsPage,
}) => {
  await test.step(`Do login as priv'd user`, async () => {
    await loginPage.loginAs('privs');
  });
  await test.step(`Go to radio details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage('WGBH_89_7_FM_20210918_040000');
    await detailsPage.radioPlayerTheaterDisplay();
    await detailsPage.verifyRadioBorrowProgramAvailable();
  });
});

test(`Load theater: radio as regular patron user`, async ({
  loginPage,
  detailsPage,
}) => {
  await test.step(`Do login as regular patron user`, async () => {
    await loginPage.loginAs('patron');
  });
  await test.step(`Go to radio details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage('WGBH_89_7_FM_20210918_040000');
    await detailsPage.radioPlayerTheaterDisplay();
    await detailsPage.verifyBorrowProgramUnavailable();
  });
});

test(`Load theater: radio as guest/not logged in user`, async ({ detailsPage }) => {
  await test.step(`Go to radio details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage('WGBH_89_7_FM_20210918_040000');
    await detailsPage.radioPlayerTheaterDisplay();
    await detailsPage.verifyBorrowProgramUnavailable();
  });
});

test(`Load theater: tv as priv'd user`, async ({
  loginPage,
  detailsPage,
}) => {
  await test.step(`Do login as priv'd user`, async () => {
    await loginPage.loginAs('privs');
  });
  await test.step(`Go to tv details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage(
      'CSPAN3_20170413_154200_Discussion_Focuses_on_Sesame_Street_and_Autism',
    );
    await detailsPage.tvTheaterDisplay();
    await detailsPage.verifyTVBorrowProgramAvailable();
  });
});

test(`Load theater: tv as patron user`, async ({
  loginPage,
  detailsPage,
}) => {
  await test.step(`Do login as patron user`, async () => {
    await loginPage.loginAs('patron');
  });
  await test.step(`Go to tv details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage(
      'CSPAN3_20170413_154200_Discussion_Focuses_on_Sesame_Street_and_Autism',
    );
    await detailsPage.tvTheaterDisplay();
    await detailsPage.verifyTVBorrowProgramAvailable();
  });
});

test(`Load theater: tv as guest/not logged in user`, async ({ detailsPage }) => {
  await test.step(`Go to tv details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage(
      'CSPAN3_20170413_154200_Discussion_Focuses_on_Sesame_Street_and_Autism',
    );
    await detailsPage.tvTheaterDisplay();
    await detailsPage.verifyTVBorrowProgramAvailable();
  });
});

test(`Load theater: video`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('0872_Angels_Flight_05_32_34_00');
  await detailsPage.videoPlayerTheaterDisplay();
});

test(`Load theater: webamp`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles');
  await detailsPage.iaMusicTheater.selectChannelSelector('Webamp');
  await detailsPage.iaMusicTheater.webAmpDisplayFromChannelSelector(true);
});

test(`Load theater: webamp with skin`, async ({ detailsPage }) => {
  await test.step('Load webAmp skin - llama feature', async () => {
    // goto a webamp skin page
    await detailsPage.gotoPage('winampskin_Tundra_Winamp_Skin_Actualized');
    // activate webamp skin - llama
    await detailsPage.activateWebAmpSkin();
  });

  await test.step('Check webamp displayed directly after webamp skin activated', async () => {
    // then go to a track page to check if it loads the webamp view is loaded
    await detailsPage.gotoPage('OTRR_Philip_Marlowe_Singles');
    await detailsPage.iaMusicTheater.webAmpDisplayFromChannelSelector(false);
  });
});

test(`Functionality: Image (carousel) - Navigate images`, async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage('img-0855_202106');
  await detailsPage.interactWithImageCarousel();
});

test(`Functionality: Radio - Search transcript`, async ({ detailsPage }) => {
  await detailsPage.gotoPage('WGBH_89_7_FM_20210918_040000');
  await detailsPage.searchRadioTranscriptAndVerifySearchEntryPositions('and');
});
