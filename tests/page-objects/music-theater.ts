import { type Page, type Locator, expect } from '@playwright/test';
import { ChannelSelector } from '../models';

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
      await expect(this.iauxPhotoViewer).toHaveAttribute('noimageavailable');
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

  async selectChannelSelector(channel: ChannelSelector) {
    this.channelSelector
      .locator('#radio')
      .getByRole('listitem')
      .filter({ hasText: channel })
      .click();
  }

  async webAmpDisplayFromChannelSelector(fromChannelSelector: boolean) {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });

    const urlPatternCheck = new RegExp(`webamp=default`);
    if (fromChannelSelector) {
      await expect(this.page).toHaveURL(urlPatternCheck);
    } else {
      await expect(this.page).not.toHaveURL(urlPatternCheck);
    }

    await expect(this.page.locator('#theatre-ia')).toBeVisible({
      timeout: 10000,
    });
    await expect(
      this.page.locator('#theatre-ia').locator('#jw6'),
    ).toBeVisible();
    await expect(this.page.locator('#main-window')).toBeVisible();
    await expect(this.page.locator('#equalizer-window')).toBeVisible();
  }

  // TODO
  async verifyWebampSkin() {}
}
