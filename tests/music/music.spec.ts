import { test, expect } from '@playwright/test';

// constants
const trackListDetails = [
  {
    number: '1',
    title: 'Squeaking Door',
    length: '00:06'
  },
  {
    number: '2',
    title: 'Steps',
    length: '00:03'
  },
  {
    number: '3',
    title: 'Steps',
    length: '00:03'
  }
];

test('Play 3 mystery sound effects', async ({ page }) => {
  await page.goto(
    'https://archive.org/details/cd_mystery-sound-effects_gateway-gecordings'
  );

  const iaMusicTheater = page.locator('ia-music-theater');
  expect(await iaMusicTheater.count()).toEqual(1);
  const musicTheater = page.locator('#music-theater');
  expect(await musicTheater.count()).toEqual(1);

  // player controls
  const channelSelector = musicTheater.locator('channel-selector');
  const channelSelectorRadio = channelSelector.locator('#radio');
  expect(await channelSelector.count()).toEqual(1);
  expect(await channelSelectorRadio.count()).toEqual(1);
  expect(await channelSelectorRadio.locator('#selector-title').count()).toEqual(1);
  const rows = channelSelectorRadio.getByRole('listitem');
  expect(await rows.count()).toEqual(2);
  await expect(rows).toHaveText(['Player', 'Webamp']);

  // photo-viewer
  const iauxPhotoViewer = musicTheater.locator('iaux-photo-viewer');
  expect(await iauxPhotoViewer.count()).toEqual(1);

  // player
  const player = musicTheater.locator('.player');
  expect(await player.count()).toEqual(2);
  const playAv = iaMusicTheater.locator('play-av');
  expect(await playAv.count()).toEqual(1);

  const playTrackList = playAv.locator('.flexbox-pages.column');
  const trackListButtons = playTrackList.getByRole('button');
  expect(await playTrackList.count()).toEqual(1);
  expect(await trackListButtons.count()).toEqual(50);

  // check first 3 of trackList details
  for (let i = 0; i < 3; ++i) {
    const trackNumber = trackListButtons.nth(i).locator('.track-number');
    const trackTitle = trackListButtons.nth(i).locator('.track-title');
    const trackLength = trackListButtons.nth(i).locator('.track-length');

    expect(await trackNumber.textContent()).toContain(trackListDetails[i].number);
    expect(await trackTitle.textContent()).toContain(trackListDetails[i].title);
    expect(await trackLength.textContent()).toContain(trackListDetails[i].length);
  }

  // select button tracks
  await trackListButtons.nth(1).click();
  await page.waitForURL(
    'https://archive.org/details/cd_mystery-sound-effects_gateway-gecordings/disc1/02.+Gateway+Gecordings+-+Steps.flac'
  );

  await trackListButtons.nth(2).click();
  await page.waitForURL(
    'https://archive.org/details/cd_mystery-sound-effects_gateway-gecordings/disc1/03.+Gateway+Gecordings+-+Steps.flac'
  );

  await page.close();
});
