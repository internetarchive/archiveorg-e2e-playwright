import { test } from '../fixtures';

import { identifier } from '../../config';

test('Load Grateful Dead Soundtrack page to check page elements', async ({
  musicPage,
}) => {
  await musicPage.detailsPage.gotoPage(identifier.details.music_theater_grateful_dead);
  await musicPage.validateMusicPageElements();
});

test(`Special case: Audio item without image - with waveform`, async ({
  musicPage,
}) => {
  await test.step(`Load the page and check page elements`, async () => {
    await musicPage.detailsPage.gotoPage(
      identifier.details.music_theater_no_image_with_waveform,
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
    await musicPage.detailsPage.gotoPage(
      identifier.details.music_theater_single_track_no_waveform,
    );
    await musicPage.validateMusicPageElements();
  });

  await test.step(`Placeholder image and waveform should not be displayed`, async () => {
    await musicPage.validateNoImageAvailableInPhotoViewerDisplay(false);
    await musicPage.validateNoWaveformDisplay(true);
  });
});

test(`Play a Grateful Dead track`, async ({ musicPage }) => {
  await musicPage.detailsPage.gotoPage(identifier.details.music_theater_grateful_dead);
  await musicPage.playAndPauseMusic();
});

test(`Open and navigate liner notes`, async ({ musicPage }) => {
  await musicPage.detailsPage.gotoPage(
    identifier.details.music_theater_single_track_no_waveform,
  );
  await musicPage.interactWithBookReader();
});
