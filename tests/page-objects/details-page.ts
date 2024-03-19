import { type Page, type Locator, expect } from '@playwright/test';

import { BookReader } from './book-reader';
import { LendingBar } from './lending-bar';

export class DetailsPage {
  readonly page: Page;

  readonly bookReader: BookReader;
  readonly lendingBar: LendingBar;

  public constructor(page: Page) {
    this.page = page;

    this.bookReader = new BookReader(page);
    this.lendingBar = new LendingBar(page);
  }

  async gotoPage(uri: string) {
    await this.page.goto(`/details/${uri}`, { waitUntil: 'networkidle' });
    await this.page.waitForTimeout(5000);
  }

  async assertPageElements() {
    await this.page.waitForTimeout(5000);
    await this.verifyPageMetadataElements();
    await this.verifyPageActionButtons();

    await expect(this.page.locator('.terms-of-service')).toBeVisible();
    // await expect(this.page.getByText('SIMILAR ITEMS (based on metadata)')).toBeVisible();
    // await expect(this.page.getByRole('heading', { name: 'SIMILAR ITEMS (based on metadata)' })).toBeVisible();
    // await expect(this.page.locator('#also-found')).toBeVisible();
  }

  async verifyPageMetadataElements() {
    const divInfoTopDetails = this.page
      .locator('div.container.info-top')
      .locator('div.thats-left.item-details-metadata');

    await expect(divInfoTopDetails.locator('.left-icon')).toBeVisible();
    await expect(divInfoTopDetails.locator('.item-title')).toBeVisible();
    await expect(
      divInfoTopDetails.locator('.metadata-definition'),
    ).toBeVisible();

    const divItemDetails = this.page
      .locator(
        '#maincontent > div.container.container-ia.width-max.relative-row-wrap',
      )
      .last();
    await expect(
      divItemDetails.locator('.boxy.item-stats-summary'),
    ).toBeVisible();
    await expect(
      divItemDetails.locator('.boxy.item-download-options'),
    ).toBeVisible();
    await expect(
      divItemDetails.locator('.boxy.white-bg.collection-list'),
    ).toBeVisible();
    await expect(
      divItemDetails.locator('.boxy.white-bg.item-upload-info'),
    ).toBeVisible();

    // reviews section
    await expect(divItemDetails.locator('#reviews')).toBeVisible();
  }

  async verifyPageActionButtons() {
    // TODO: this is only visible if loggedIn as priv user
    // await expect(this.page.locator('#item-user-lists')).toBeVisible();
    await expect(
      this.page.locator('div.topinblock.favorite-btn'),
    ).toBeVisible();
    await expect(
      this.page.locator('div.topinblock.share-button'),
    ).toBeVisible();
    await expect(this.page.locator('div.topinblock.flag-button')).toBeVisible();
  }

  async verify3dTheaterDisplay() {
    await expect(this.page.locator('#container3D')).toBeVisible();
  }

  async verifyBookreaderDisplay() {
    await expect(this.bookReader.bookReaderShell).toBeVisible();
  }

  async verifyLendingBarDisplay() {
    await expect(this.lendingBar.iaBookActions).toBeVisible();
  }
}
