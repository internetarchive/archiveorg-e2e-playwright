import { type Page, type Locator, expect } from '@playwright/test';

import { BookReader } from './book-reader';
import { DetailsPage } from './details-page';
import { IAMusicTheater } from './music-theater';

export class MusicPage {
  readonly page: Page;

  readonly bookReader: BookReader;
  readonly detailsPage: DetailsPage;
  readonly iaMusicTheater: IAMusicTheater;

  public constructor(page: Page) {
    this.page = page;

    this.bookReader = new BookReader(page);
    this.detailsPage = new DetailsPage(page);
    this.iaMusicTheater = new IAMusicTheater(page);
  }

  async validateMusicPageElements() {
    // player controls
    await expect(this.iaMusicTheater.musicTheater).toBeVisible();
    await expect(this.iaMusicTheater.channelSelector).toBeVisible();

    const rows = this.iaMusicTheater.channelSelector
      .locator('#radio')
      .getByRole('listitem');
    expect(await rows.count()).toEqual(2);
    await expect(rows).toHaveText(['Player', 'Webamp']);

    await expect(this.iaMusicTheater.iauxPhotoViewer).toBeVisible();
    await expect(this.iaMusicTheater.playAv).toBeVisible();

    await expect(
      this.iaMusicTheater.playAv.locator('div.playlist > div.track-list'),
    ).toBeVisible();
  }

  async validateNoImageAvailableInPhotoViewerDisplay(noPlaceholder: boolean) {
    if (noPlaceholder) {
      await expect(this.iaMusicTheater.iauxPhotoViewer).toHaveAttribute(
        'noimageavailable',
      );
      await expect(
        this.iaMusicTheater.iauxPhotoViewer.locator('iamusic-noimage'),
      ).toBeVisible();
      await expect(this.bookReader.bookReaderShell).not.toBeVisible();
    } else {
      await expect(this.iaMusicTheater.iauxPhotoViewer).not.toHaveAttribute(
        'noimageavailable',
      );
      await expect(this.iaMusicTheater.seeMoreCta).toBeVisible();
      await expect(this.bookReader.bookReaderShell).toBeVisible();
    }
  }

  async getBookReaderClass() {
    return await this.bookReader.bookReaderShell.getAttribute('class');
  }

  async interactWithBookReader() {
    const oneUpClass = 'BRmode1up';
    const thumbViewModeClass = 'BRmodeThumb';
    const fullScreenClass = 'fullscreenActive';

    await this.iaMusicTheater.seeMoreCta.click({ timeout: 10000 });
    await expect(this.iaMusicTheater.iauxPhotoViewer).toHaveAttribute(
      'showallphotos',
    );

    // default load
    expect(await this.getBookReaderClass()).toContain(oneUpClass);

    // click thumbnail mode
    await this.bookReader.brThumb.click();
    expect(await this.getBookReaderClass()).toContain(thumbViewModeClass);

    // click 1up mode
    await this.bookReader.brOnePage.click();
    expect(await this.getBookReaderClass()).toContain(oneUpClass);

    // click fullscreen
    await this.bookReader.brFullScreen.click();
    expect(await this.getBookReaderClass()).toContain(fullScreenClass);

    // click fullscreen again
    await this.bookReader.brFullScreen.click();
    expect(await this.getBookReaderClass()).not.toContain(fullScreenClass);

    // close BookReader photoViewer
    await this.iaMusicTheater.iauxPhotoViewer
      .locator('#close-photo-viewer')
      .click();

    await expect(this.iaMusicTheater.iauxPhotoViewer).not.toHaveAttribute(
      'showallphotos',
    );
  }

  async validateNoWaveformDisplay(noWaveform: boolean) {
    const blackWaveform = 'https://archive.org/images/black.jpg';
    if (noWaveform) {
      expect(
        await this.iaMusicTheater.playAv
          .locator('#waveformer-wrap > img')
          .getAttribute('src'),
      ).toBe(blackWaveform);
    } else {
      expect(
        await this.iaMusicTheater.playAv
          .locator('#waveformer-wrap > img')
          .getAttribute('src'),
      ).not.toBe(blackWaveform);
    }
  }

  async playAndPauseMusic() {
    // Play music
    await this.iaMusicTheater.musicPlayerPlayButton.click();
    await expect(
      this.page.locator('#jw6.jwplayer.jw-reset.jw-state-playing'),
    ).toBeVisible();
    // Pause music
    await this.iaMusicTheater.musicPlayerPauseButton.click();
    await expect(
      this.page.locator('#jw6.jwplayer.jw-reset.jw-state-paused'),
    ).toBeVisible();
  }
}
