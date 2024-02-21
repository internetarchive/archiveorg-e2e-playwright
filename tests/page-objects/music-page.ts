import { type Page, expect } from '@playwright/test';

export class MusicPage {
  readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
  }

  async gotoMusicPage(page: string) {
    await this.page.goto(`/details/${page}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
  }

  async validatePageElements() {
    // player controls
    const musicTheater = this.page.locator('#music-theater');
    const channelSelector = this.page.locator('channel-selector');
    await expect(musicTheater).toBeVisible({ timeout: 60000 });
    await expect(channelSelector).toBeVisible({ timeout: 60000 });

    const rows = channelSelector.locator('#radio').getByRole('listitem');
    expect(await rows.count()).toEqual(2);
    await expect(rows).toHaveText(['Player', 'Webamp']);

    // photo-viewer
    const iauxPhotoViewer = this.page.locator('iaux-photo-viewer');
    await expect(iauxPhotoViewer).toBeVisible({ timeout: 60000 });
  }

  async playAndPauseMusic() {
    // Play music
    await this.page.getByRole('button', { name: 'Play', exact: true }).click();
    await expect(
      this.page.locator('#jw6.jwplayer.jw-reset.jw-state-playing'),
    ).toBeVisible({ timeout: 60000 });
    // Pause music
    await this.page.getByRole('button', { name: 'Pause' }).click();
    await expect(
      this.page.locator('#jw6.jwplayer.jw-reset.jw-state-paused'),
    ).toBeVisible({ timeout: 60000 });
  }
}
