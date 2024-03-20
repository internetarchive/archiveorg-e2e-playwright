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
    const channelSelectorRow = await this.channelSelector
      .locator('#radio')
      .getByRole('listitem');
    const channelSelectorRowCount = await this.channelSelector
      .locator('#radio')
      .getByRole('listitem')
      .count();

    // just Player | Webamp
    if (channelSelectorRowCount === 2) {
      if (channel === 'Player') await channelSelectorRow.nth(0).click();
      if (channel === 'Webamp') await channelSelectorRow.nth(1).click();
    }
  }

  async verifyWebampDisplay() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);

    const urlPatternCheck = new RegExp(`webamp=default`);
    await expect(this.page).toHaveURL(urlPatternCheck);
    await expect(this.page.locator('#webamp')).toBeVisible();
  }

  async verifyWebampSkin() {
    // <#theatre-controls > a > div
    // js-webamp-skin-item
  }
}
