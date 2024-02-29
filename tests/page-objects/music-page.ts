import { type Page, type Locator, expect } from '@playwright/test';

export class MusicPage {
  readonly page: Page;
  readonly iauxPhotoViewer: Locator;
  readonly iauxMusicTheater: Locator;
  readonly playAv: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.iauxMusicTheater = this.page.locator('ia-music-theater');
    this.iauxPhotoViewer = this.page.locator('#music-theater > iaux-photo-viewer');
    this.playAv = this.page.locator('play-av');
  }

  async gotoMusicPage(uri: string) {
    await this.page.goto(`/details/${uri}`, {
      waitUntil: 'networkidle',
      timeout: 120000,
    });
    await this.page.waitForTimeout(5000);
  }

  async validateCommonPageElements() {
    // player controls
    const musicTheater = this.iauxMusicTheater.locator('#music-theater');
    const channelSelector = this.iauxMusicTheater.locator('channel-selector');
    await expect(musicTheater).toBeVisible({ timeout: 60000 });
    await expect(channelSelector).toBeVisible({ timeout: 60000 });

    const rows = channelSelector.locator('#radio').getByRole('listitem');
    expect(await rows.count()).toEqual(2);
    await expect(rows).toHaveText(['Player', 'Webamp']);

    await expect(this.iauxPhotoViewer).toBeVisible({ timeout: 60000 });
    await expect(this.playAv).toBeVisible({ timeout: 60000 });
  }

  async validateNoImageAvailableInPhotoViewerDisplay(noImage: boolean) {
    if (noImage) {
      expect(await this.iauxPhotoViewer.getAttribute('noimageavailable')).toBe('')
      await expect(this.iauxPhotoViewer.locator('iamusic-noimage')).toBeVisible({timeout: 60000});
      await expect(this.iauxMusicTheater.locator('#BookReader')).not.toBeVisible({timeout: 60000});
    } else {
      expect(await this.iauxPhotoViewer.getAttribute('noimageavailable')).toBe(null);
      await expect(this.iauxPhotoViewer.locator('#see-more-cta')).toBeVisible({timeout: 60000});
      await expect(this.iauxMusicTheater.locator('#BookReader')).toBeVisible({timeout: 60000});
    }
  }

  async validateNoWaveformDisplay(noWaveform: boolean) {
    const blackWaveform = 'https://archive.org/images/black.jpg';
    if(noWaveform) {
      expect(await this.playAv.locator('#waveformer-wrap > img').getAttribute('src')).toBe(blackWaveform)
    } else {
      expect(await this.playAv.locator('#waveformer-wrap > img').getAttribute('src')).not.toBe(blackWaveform)
    }
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
