import { test, expect } from '@playwright/test';

// constants
const trackListDetails = [
  {
    number: '1',
    title: 'Morning Dew',
    length: '11:18',
  },
  {
    number: '2',
    title: 'Beat It On Down The Line',
    length: '02:14',
  },
  {
    number: '3',
    title: 'Ramble On Rose',
    length: '07:44',
  },
];

test('Play a Grateful Sound track', async ({ page }) => {
  await page.goto('https://archive.org/details/gd73-06-10.sbd.hollister.174.sbeok.shnf', { waitUntil: 'networkidle', timeout: 60000});

  const iaMusicTheater = page.locator('ia-music-theater');
  const musicTheater = page.locator('#music-theater');

  // player controls
  const channelSelector = musicTheater.locator('channel-selector');
  const channelSelectorRadio = channelSelector.locator('#radio');
  await expect(channelSelector).toBeVisible();
  await expect(channelSelectorRadio).toBeVisible();
  await expect(channelSelectorRadio.locator('#selector-title')).toBeVisible();

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
  expect(await trackListButtons.count()).toEqual(31);

  await page.waitForTimeout(5000);

  // check first 3 of trackList details
  for (let i = 0; i < 3; ++i) {
    const trackNumber = trackListButtons.nth(i).locator('.track-number');
    const trackTitle = trackListButtons.nth(i).locator('.track-title');
    const trackLength = trackListButtons.nth(i).locator('.track-length');

    expect(await trackNumber.innerText()).toContain(
      trackListDetails[i].number,
    );
    expect(await trackTitle.innerText()).toContain(trackListDetails[i].title);
    expect(await trackLength.innerText()).toContain(
      trackListDetails[i].length,
    );
  }

  const jwPlayControl = page.locator('#jw6 > div.jw-wrapper.jw-reset > div.jw-controls.jw-reset > div.jw-controlbar.jw-reset > div > div.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-playback');

  // Play music
  await jwPlayControl.click();
  await page.waitForTimeout(3000);
  expect(await jwPlayControl.getAttribute('aria-label')).toBe('Pause');

  // Pause music
  await jwPlayControl.click();
  await page.waitForTimeout(3000);
  expect(await jwPlayControl.getAttribute('aria-label')).toBe('Play');

  await page.close();
});
