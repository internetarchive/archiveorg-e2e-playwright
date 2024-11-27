import { test } from '../fixtures';

import { identifier } from '../../config';

test('Basic display: Items display item details page', async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage(identifier.details.default);
  await detailsPage.assertPageElements();
});

test('Load theater: 3d viewer', async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.three_d_viewer);
  await detailsPage.container3dDisplay();
});

test(`Load theater: audio (image carousel / bookreader)`, async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage(identifier.details.audio_image_carousel);
  await detailsPage.musicTheaterDisplayWithCoverArt();
});

test(`Load theater: audio single image`, async ({ detailsPage }) => {
  await test.step('Load a page with single image', async () => {
    await detailsPage.gotoPage(identifier.details.audio_single_image_1);
    await detailsPage.musicTheaterDisplaySingleImage();
  });

  await test.step('Load another page with single image', async () => {
    await detailsPage.gotoPage(identifier.details.audio_single_image_2);
    await detailsPage.musicTheaterDisplaySingleImage();
  });
});

test(`Load theater: bookreader`, async ({ detailsPage }) => {
  await test.step('Load a book page', async () => {
    await detailsPage.gotoPage(identifier.details.bookreader);
    await detailsPage.bookreaderDisplay();
  });
});

test(`Load theater: data`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.archive_data);
  await detailsPage.dataTheaterDisplay();
});

test(`Load theater: software emulation`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.software_emulation);
  await detailsPage.softwareEmulationTheaterDisplay();
});

test(`Load theater: image (carousel)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.image_carousel);
  await detailsPage.imageCarouselMultipleImageDisplay(true);
});

test(`Load theater: image (single)`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.image_single);
  await detailsPage.imageCarouselMultipleImageDisplay(false);
});

test.fixme(
  `Load theater: radio as priv'd user`,
  async ({ loginPage, detailsPage }) => {
    await test.step(`Do login as priv'd user`, async () => {
      await loginPage.loginAs('privs');
    });
    await test.step(`Go to radio details page and verify priv'd user borrow program`, async () => {
      await detailsPage.gotoPage(identifier.details.radio_borrow);
      await detailsPage.radioPlayerTheaterDisplay();
      await detailsPage.verifyRadioBorrowProgramAvailable();
    });
  },
);

test.fixme(
  `Load theater: radio as regular patron user`,
  async ({ loginPage, detailsPage }) => {
    await test.step(`Do login as regular patron user`, async () => {
      await loginPage.loginAs('patron');
    });
    await test.step(`Go to radio details page and verify priv'd user borrow program`, async () => {
      await detailsPage.gotoPage(identifier.details.radio_borrow);
      await detailsPage.radioPlayerTheaterDisplay();
      await detailsPage.verifyRadioBorrowProgramUnavailable();
    });
  },
);

test.fixme(
  `Load theater: radio as guest/not logged in user`,
  async ({ detailsPage }) => {
    await test.step(`Go to radio details page and verify priv'd user borrow program`, async () => {
      await detailsPage.gotoPage(identifier.details.radio_borrow);
      await detailsPage.radioPlayerTheaterDisplay();
      await detailsPage.verifyRadioBorrowProgramUnavailable();
    });
  },
);

test(`Load theater: tv as priv'd user`, async ({ loginPage, detailsPage }) => {
  await test.step(`Do login as priv'd user`, async () => {
    await loginPage.loginAs('privs');
  });
  await test.step(`Go to tv details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage(identifier.details.tv_borrow);
    await detailsPage.tvTheaterDisplay();
    await detailsPage.verifyTVBorrowProgramAvailable();
  });
});

test.fixme(
  `Load theater: tv as patron user`,
  async ({ loginPage, detailsPage }) => {
    await test.step(`Do login as patron user`, async () => {
      await loginPage.loginAs('patron');
    });
    await test.step(`Go to tv details page and verify priv'd user borrow program`, async () => {
      await detailsPage.gotoPage(identifier.details.tv_borrow);
      await detailsPage.tvTheaterDisplay();
      await detailsPage.verifyTVBorrowProgramAvailable();
    });
  },
);

test(`Load theater: tv as guest/not logged in user`, async ({
  detailsPage,
}) => {
  await test.step(`Go to tv details page and verify priv'd user borrow program`, async () => {
    await detailsPage.gotoPage(identifier.details.tv_borrow);
    await detailsPage.tvTheaterDisplay();
    await detailsPage.verifyTVBorrowProgramAvailable();
  });
});

test(`Load theater: video`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.theater_video);
  await detailsPage.videoPlayerTheaterDisplay();
});

test(`Load theater: webamp`, async ({ detailsPage }) => {
  await detailsPage.gotoPage(identifier.details.webamp);
  await detailsPage.iaMusicTheater.selectChannelSelector('Webamp');
  await detailsPage.iaMusicTheater.webAmpDisplayFromChannelSelector(true);
});

test(`Load theater: webamp with skin`, async ({ detailsPage }) => {
  await test.step('Load webAmp skin - llama feature', async () => {
    // goto a webamp skin page
    await detailsPage.gotoPage(identifier.details.webamp_with_skin);
    // activate webamp skin - llama
    await detailsPage.activateWebAmpSkin();
  });

  await test.step('Check webamp displayed directly after webamp skin activated', async () => {
    // then go to a track page to check if it loads the webamp view is loaded
    await detailsPage.gotoPage(identifier.details.webamp);
    await detailsPage.iaMusicTheater.webAmpDisplayFromChannelSelector(false);
  });
});

test(`Functionality: Image (carousel) - Navigate images`, async ({
  detailsPage,
}) => {
  await detailsPage.gotoPage(identifier.details.image_carousel);
  await detailsPage.interactWithImageCarousel();
});

test.fixme(
  `Functionality: Radio - Search transcript`,
  async ({ detailsPage }) => {
    await detailsPage.gotoPage(identifier.details.radio_borrow);
    await detailsPage.searchRadioTranscriptAndVerifySearchEntryPositions('and');
  },
);
