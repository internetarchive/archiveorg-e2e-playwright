import { test } from '../fixtures';

test('Load and Play a Grateful Dead Soundtrack', async ({ musicPage }) => {
  await musicPage.gotoMusicPage('gd73-06-10.sbd.hollister.174.sbeok.shnf');
  await musicPage.validateMusicPageElements();
  await musicPage.playAndPauseMusic();
});

test(`Special case: Audio item without image - with waveform`, async ({
  musicPage,
}) => {
  await musicPage.gotoMusicPage('gd77-05-08.sbd.hicks.4982.sbeok.shnf');
  await musicPage.validateMusicPageElements();
  await musicPage.validateNoImageAvailableInPhotoViewerDisplay(true);
  await musicPage.validateNoWaveformDisplay(false);
});

test(`Special case: Load a single track - no waveform`, async ({
  musicPage,
}) => {
  await musicPage.gotoMusicPage('berceuse00benj');
  await musicPage.validateMusicPageElements();
  await musicPage.validateNoImageAvailableInPhotoViewerDisplay(false);
  await musicPage.validateNoWaveformDisplay(true);
});
