import { type Page, type Locator, expect } from '@playwright/test';

import { BookPage } from './book-page';
export class MusicPage {
  readonly page: Page;

  readonly iauxPhotoViewer: Locator;
  readonly iauxMusicTheater: Locator;
  readonly playAv: Locator;
  readonly seeMoreCta: Locator;
  readonly brSlot: Locator;
  readonly bookReaderShell: Locator;

  readonly bookPage: BookPage;

  public constructor(page: Page) {
    this.page = page;

    this.iauxMusicTheater = this.page.locator('ia-music-theater');
    this.iauxPhotoViewer = this.page.locator(
      '#music-theater > iaux-photo-viewer',
    );
    this.playAv = this.page.locator('play-av');
    this.seeMoreCta = this.iauxPhotoViewer.locator('#see-more-cta');
    this.brSlot = this.page.locator('#theatre-ia > div.row > div > ia-music-theater > div.bookreader-slot');
    this.bookReaderShell = this.brSlot.locator('#BookReader');
  }

  async gotoMusicPage(uri: string) {
    await this.page.goto(`/details/${uri}`, {
      waitUntil: 'networkidle',
      timeout: 120000,
    });
    await this.page.waitForTimeout(5000);
  }

  async validateMusicPageElements() {
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

    await expect(
      this.playAv.locator('div.playlist > div.track-list'),
    ).toBeVisible({ timeout: 60000 });
  }

  async validateNoImageAvailableInPhotoViewerDisplay(noPlaceholder: boolean) {
    console.log('noPlaceholder: ', noPlaceholder)
    
    if (noPlaceholder) {
      expect(await this.iauxPhotoViewer.getAttribute('noimageavailable')).toBe(
        '',
      );
      await expect(this.iauxPhotoViewer.locator('iamusic-noimage')).toBeVisible(
        { timeout: 60000 },
      );
      await expect(
        this.iauxMusicTheater.locator('#BookReader'),
      ).not.toBeVisible({ timeout: 60000 });
    } else {
      expect(await this.iauxPhotoViewer.getAttribute('noimageavailable')).toBe(
        null,
      );
      await expect(this.seeMoreCta).toBeVisible({
        timeout: 60000,
      });
      await expect(this.iauxMusicTheater.locator('#BookReader')).toBeVisible({
        timeout: 60000,
      });

      await this.interactWithBookReader();
    }
  }

  async getBookReaderClass() {
    return await this.bookReaderShell.getAttribute('class', { timeout: 3000 });
  }

  async interactWithBookReader() {
    console.log('interact with bookreader')

    const oneUpClass = 'BRmode1up';
    const thumbViewModeClass = 'BRmodeThumb';
    const fullScreenClass = 'fullscreenActive';
    const brFooter = this.bookReaderShell.locator('.BRfooter');

    await this.seeMoreCta.click({ timeout: 30000 });
    expect(await this.iauxPhotoViewer.getAttribute('showallphotos')).toBe('');

    // initial load
    expect(await this.getBookReaderClass()).toContain(oneUpClass);

    // click fullscreen
    await brFooter.locator('.BRicon.full').click();
    expect(await this.getBookReaderClass()).toContain(fullScreenClass);

    // click thumbnail mode
    await brFooter.locator('.BRicon.thumb').click();
    expect(await this.getBookReaderClass()).toContain(thumbViewModeClass);

    // close BookReader photoViewer
    await this.iauxPhotoViewer.locator('#close-photo-viewer').click();
    expect(await this.iauxPhotoViewer.getAttribute('showallphotos')).toBe(null);
  }

  async validateNoWaveformDisplay(noWaveform: boolean) {
    const blackWaveform = 'https://archive.org/images/black.jpg';
    if (noWaveform) {
      expect(
        await this.playAv.locator('#waveformer-wrap > img').getAttribute('src'),
      ).toBe(blackWaveform);
    } else {
      expect(
        await this.playAv.locator('#waveformer-wrap > img').getAttribute('src'),
      ).not.toBe(blackWaveform);
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
