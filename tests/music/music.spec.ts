import { test, expect } from '@playwright/test';

test('Play a Grateful Sound track', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/details/gd73-06-10.sbd.hollister.174.sbeok.shnf', {
    waitUntil: 'networkidle'
  });

  // player controls
  const musicTheater = page.locator('#music-theater');
  const channelSelector = page.locator('channel-selector');
  await expect(musicTheater).toBeVisible();
  await expect(channelSelector).toBeVisible();

  const rows = channelSelector.locator('#radio').getByRole('listitem');
  expect(await rows.count()).toEqual(2);
  await expect(rows).toHaveText(['Player', 'Webamp']);

  // photo-viewer
  const iauxPhotoViewer = page.locator('iaux-photo-viewer');
  await (expect(iauxPhotoViewer)).toBeVisible();

  // Play music
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await (expect(page.locator('#jw6.jwplayer.jw-reset.jw-state-playing'))).toBeVisible();
  // Pause music
  await page.getByRole('button', { name: 'Pause' }).click();
  await (expect(page.locator('#jw6.jwplayer.jw-reset.jw-state-paused'))).toBeVisible();

  await page.close();
});
