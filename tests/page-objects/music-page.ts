import { type Page, type Locator, expect } from '@playwright/test';

export class MusicPage {
  readonly page: Page;

  readonly iauxPhotoViewer: Locator;
  readonly iauxMusicTheater: Locator;
  readonly playAv: Locator;
  readonly seeMoreCta: Locator;
  readonly brSlot: Locator;
  readonly bookReaderShell: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.iauxMusicTheater = this.page.locator('ia-music-theater');
    this.iauxPhotoViewer = this.page.locator(
      '#music-theater > iaux-photo-viewer',
    );
    this.playAv = this.page.locator('play-av');
    this.seeMoreCta = this.iauxPhotoViewer.locator('#see-more-cta');
    this.brSlot = this.page.locator(
      '#theatre-ia > div.row > div > ia-music-theater > div.bookreader-slot',
    );
    this.bookReaderShell = this.brSlot.locator('#BookReader');
  }

  async gotoMusicPage(uri: string) {
    await this.page.goto(`/details/${uri}`, {
      waitUntil: 'networkidle',
    });
    await this.page.waitForTimeout(5000);
  }

  async validateMusicPageElements() {
    // player controls
    const musicTheater = this.iauxMusicTheater.locator('#music-theater');
    const channelSelector = this.iauxMusicTheater.locator('channel-selector');
    await expect(musicTheater).toBeVisible();
    await expect(channelSelector).toBeVisible();

    const rows = channelSelector.locator('#radio').getByRole('listitem');
    expect(await rows.count()).toEqual(2);
    await expect(rows).toHaveText(['Player', 'Webamp']);

    await expect(this.iauxPhotoViewer).toBeVisible();
    await expect(this.playAv).toBeVisible();

    await expect(
      this.playAv.locator('div.playlist > div.track-list'),
    ).toBeVisible();
  }

  async validateNoImageAvailableInPhotoViewerDisplay(noPlaceholder: boolean) {
    if (noPlaceholder) {
      expect(await this.iauxPhotoViewer.getAttribute('noimageavailable')).toBe(
        '',
      );
      await expect(
        this.iauxPhotoViewer.locator('iamusic-noimage'),
      ).toBeVisible();
      await expect(
        this.iauxMusicTheater.locator('#BookReader'),
      ).not.toBeVisible();
    } else {
      expect(await this.iauxPhotoViewer.getAttribute('noimageavailable')).toBe(
        null,
      );
      await expect(this.seeMoreCta).toBeVisible();
      await expect(this.iauxMusicTheater.locator('#BookReader')).toBeVisible();
    }
  }

  async getBookReaderClass() {
    return await this.bookReaderShell.getAttribute('class');
  }

  async interactWithBookReader() {
    const oneUpClass = 'BRmode1up';
    const thumbViewModeClass = 'BRmodeThumb';
    const fullScreenClass = 'fullscreenActive';
    const brFooter = this.bookReaderShell.locator('.BRfooter');

    await this.seeMoreCta.click({ timeout: 10000 });
    expect(await this.iauxPhotoViewer.getAttribute('showallphotos')).toBe('');

    // default load
    expect(await this.getBookReaderClass()).toContain(oneUpClass);

    // click thumbnail mode
    await brFooter.locator('.BRicon.thumb').click();
    expect(await this.getBookReaderClass()).toContain(thumbViewModeClass);

    // click 1up mode
    await brFooter.locator('.BRicon.onepg').click();
    expect(await this.getBookReaderClass()).toContain(oneUpClass);

    // click fullscreen
    await brFooter.locator('.BRicon.full').click();
    expect(await this.getBookReaderClass()).toContain(fullScreenClass);

    // click fullscreen again
    await brFooter.locator('.BRicon.full').click();
    expect(await this.getBookReaderClass()).not.toContain(fullScreenClass);

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
    ).toBeVisible();
    // Pause music
    await this.page.getByRole('button', { name: 'Pause' }).click();
    await expect(
      this.page.locator('#jw6.jwplayer.jw-reset.jw-state-paused'),
    ).toBeVisible();
  }
}
