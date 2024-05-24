import { test } from '../fixtures';

test('Load Grateful Dead Soundtrack page to check page elements', async ({
  musicPage,
}) => {
  await musicPage.detailsPage.gotoPage(
    'gd73-06-10.sbd.hollister.174.sbeok.shnf',
  );
  await musicPage.validateMusicPageElements();
});

test(`Special case: Audio item without image - with waveform`, async ({
  musicPage,
}) => {
  await test.step(`Load the page and check page elements`, async () => {
    await musicPage.detailsPage.gotoPage(
      'gd77-05-08.sbd.hicks.4982.sbeok.shnf',
    );
    await musicPage.validateMusicPageElements();
  });

  await test.step(`Placeholder image and waveform should be displayed`, async () => {
    await musicPage.validateNoImageAvailableInPhotoViewerDisplay(true);
    await musicPage.validateNoWaveformDisplay(false);
  });
});

test(`Special case: Load a single track - no waveform`, async ({
  musicPage,
}) => {
  await test.step(`Load the page and check page elements`, async () => {
    await musicPage.detailsPage.gotoPage('berceuse00benj');
    await musicPage.validateMusicPageElements();
  });

  await test.step(`Placeholder image and waveform should not be displayed`, async () => {
    await musicPage.validateNoImageAvailableInPhotoViewerDisplay(false);
    await musicPage.validateNoWaveformDisplay(true);
  });
});

test.fixme(`Play a Grateful Dead track`, async ({ musicPage }) => {
  await musicPage.detailsPage.gotoPage(
    'gd73-06-10.sbd.hollister.174.sbeok.shnf',
  );
  await musicPage.playAndPauseMusic();
});

test(`Open and navigate liner notes`, async ({ musicPage }) => {
  await musicPage.detailsPage.gotoPage('berceuse00benj');
  await musicPage.interactWithBookReader();
});
