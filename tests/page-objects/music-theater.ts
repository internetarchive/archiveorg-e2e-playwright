import { type Page, type Locator, expect } from '@playwright/test';

export class IAMusicTheater {
  readonly page: Page;

  readonly musicTheater: Locator;
  readonly channelSelector: Locator;
  readonly iauxPhotoViewer: Locator;
  readonly playAv: Locator;
  readonly seeMoreCta: Locator;

  readonly musicPlayerPlayButton: Locator;
  readonly musicPlayerPauseButton: Locator;

  public constructor(page: Page) {
    this.page = page;

    const iauxMusicTheater = this.page.locator('ia-music-theater');
    this.musicTheater = iauxMusicTheater.locator('#music-theater');
    this.channelSelector = this.musicTheater.locator('channel-selector');

    this.iauxPhotoViewer = this.musicTheater.locator('iaux-photo-viewer');
    this.playAv = this.page.locator('play-av');
    this.seeMoreCta = this.iauxPhotoViewer.locator('#see-more-cta');

    this.musicPlayerPlayButton = this.page.getByRole('button', {
      name: 'Play',
      exact: true,
    });

    this.musicPlayerPauseButton = this.page.getByRole('button', {
      name: 'Pause',
      exact: true,
    });
  }

  async placeholderImageDisplay(noPlaceholder: boolean) {
    if (noPlaceholder) {
      await expect(this.iauxPhotoViewer).toHaveAttribute(
        'noimageavailable',
      );
      await expect(
        this.iauxPhotoViewer.locator('iamusic-noimage'),
      ).toBeVisible();
    } else {
      await expect(this.iauxPhotoViewer).not.toHaveAttribute(
        'noimageavailable',
      );
      await expect(this.seeMoreCta).toBeVisible();
    }
  }
}
