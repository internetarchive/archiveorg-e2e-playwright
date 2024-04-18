import { type Page, type Locator, expect } from '@playwright/test';

import { BookReader } from './book-reader';
import { LendingBar } from './lending-bar';
import { IAMusicTheater } from './music-theater';

export class DetailsPage {
  readonly page: Page;

  readonly iaTheater: Locator;
  readonly iaCarousel: Locator;

  readonly bookReader: BookReader;
  readonly iaMusicTheater: IAMusicTheater;
  readonly lendingBar: LendingBar;

  public constructor(page: Page) {
    this.page = page;

    this.iaTheater = this.page.locator('#theatre-ia');
    this.iaCarousel = this.iaTheater.locator('#ia-carousel');

    this.bookReader = new BookReader(page);
    this.iaMusicTheater = new IAMusicTheater(page);
    this.lendingBar = new LendingBar(page);
  }

  async gotoPage(uri: string) {
    await this.page.goto(`/details/${uri}`, { waitUntil: 'load' });
  }

  async assertPageElements() {
    await this.verifyPageMetadataElements();
    await this.verifyPageActionButtons();

    await expect(this.page.locator('.terms-of-service')).toBeVisible();
    await this.page.waitForTimeout(3000);
    // TODO: add test to check Similar Items - this is currently not working
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

  async container3dDisplay() {
    await expect(this.page.locator('#container3D')).toBeVisible();
  }

  async bookreaderDisplay() {
    await expect(this.bookReader.bookReaderShell).toBeVisible();
  }

  async lendingBarDisplay() {
    await expect(this.lendingBar.iaBookActions).toBeVisible();
  }

  async musicTheaterDisplayWithPlaceholder() {
    await expect(this.iaMusicTheater.musicTheater).toBeVisible();
    await expect(this.iaMusicTheater.seeMoreCta).toBeVisible();
  }

  async musicTheaterDisplayWithCoverArt() {
    await expect(this.iaMusicTheater.musicTheater).toBeVisible();
    await expect(this.iaMusicTheater.seeMoreCta).toBeVisible();
  }

  async musicTheaterDisplaySingleImage() {
    await expect(this.iaMusicTheater.musicTheater).toBeVisible();
    await expect(this.iaMusicTheater.seeMoreCta).not.toBeVisible();
  }

  async dataTheaterDisplay() {
    await expect(this.iaTheater.locator('.no-preview')).toBeVisible();
    await expect(
      this.iaTheater.getByText('There Is No Preview Available'),
    ).toBeVisible();
  }

  async imageCarouselMultipleImageDisplay(multiple: boolean) {
    await expect(this.iaTheater.locator('#ia-carousel')).toBeVisible();

    const innerCarousel = this.iaTheater.locator('#ia-carousel > div');
    const innerCarouselItem = this.iaTheater.locator(
      '#ia-carousel > div > div.item',
    );
    if (multiple) {
      expect(await innerCarousel.getAttribute('class')).toContain(
        'carousel-inner multiple-images',
      );
      expect((await innerCarouselItem.all()).length).toBeGreaterThan(1);
    } else {
      expect(await innerCarousel.getAttribute('class')).toContain(
        'carousel-inner',
      );
      expect((await innerCarouselItem.all()).length).toEqual(1);
    }
  }

  async radioPlayerTheaterDisplay() {
    await expect(this.iaTheater.locator('radio-player')).toBeVisible();
  }

  async tvTheaterDisplay() {
    await expect(this.page.locator('#tvbanner')).toBeVisible();
    await expect(this.page.locator('#cols')).toBeVisible();
  }

  async verifyRadioBorrowProgramAvailable() {
    await expect(
      this.page.locator('div.topinblock.borrow-program-btn'),
    ).toBeVisible();
    await expect(this.page.locator('#radio-borrow-button')).toBeVisible();

    await expect(
      this.page.locator('span:has-text("Borrow Program")'),
    ).toBeVisible();
  }

  async verifyRadioBorrowProgramUnavailable() {
    await expect(
      this.page.locator('div.topinblock.borrow-program-btn'),
    ).not.toBeVisible();
    await expect(this.page.locator('#radio-borrow-button')).not.toBeVisible();

    await expect(
      this.page.locator('span:has-text("Borrow Program")'),
    ).not.toBeVisible();
  }

  async verifyTVBorrowProgramAvailable() {
    // Borrow Program is always visible for everyone
    await expect(
      this.page.locator('div.topinblock.borrow-dvd-btn'),
    ).toBeVisible();
    await expect(this.page.locator('#tvborrow')).toBeVisible();

    await expect(
      this.page.locator('span:has-text("Borrow Program")'),
    ).toBeVisible();
  }

  async videoPlayerTheaterDisplay() {
    await expect(this.iaTheater.locator('#jw6')).toBeVisible();
  }

  async softwareEmulationTheaterDisplay() {
    const emulator = this.page.locator('#emulate');
    await expect(emulator).toBeVisible();
    await expect(this.iaTheater.locator('#emulate')).toBeVisible();
  }

  async interactWithImageCarousel() {
    // This test assume the image carousel item index always starts at 0
    const leftArrowControl = this.iaCarousel.locator('a.left.carousel-control');
    const rightArrowControl = this.iaCarousel.locator(
      'a.right.carousel-control',
    );
    const carouselItems = this.iaCarousel.locator(
      'div.carousel-inner > div.item',
    );

    // load next image
    await rightArrowControl.click();
    await this.page.waitForTimeout(3000);
    expect(await carouselItems.nth(1).getAttribute('class')).toContain(
      'active',
    );

    // load prev image
    await leftArrowControl.click();
    await this.page.waitForTimeout(3000);
    expect(await carouselItems.first().getAttribute('class')).toContain(
      'active',
    );
  }

  async activateWebAmpSkin() {
    await this.iaTheater.locator('.js-webamp-use_skin_for_audio_items').click();
  }

  async searchRadioTranscriptAndVerifySearchEntryPositions(str: string) {
    const expandableSearchBar = this.page.locator('expandable-search-bar');
    await expect(expandableSearchBar.locator('#search-input')).toBeVisible();
    await expandableSearchBar.locator('#search-input').fill(str);
    await expandableSearchBar.locator('#search-input').press('Enter');
    await this.page.waitForTimeout(3000);

    // interact with search results range
    const searchResultsSwitcher = this.page.locator('search-results-switcher');
    const prevButton = searchResultsSwitcher.locator('#previous-button');
    const nextButton = searchResultsSwitcher.locator('#next-button');
    await expect(searchResultsSwitcher).toBeVisible();

    expect(
      await searchResultsSwitcher
        .locator('div > span.results-range #current-result')
        .innerText(),
    ).toBe('1');
    expect(
      await searchResultsSwitcher
        .locator('div > span.results-range #number-of-results')
        .innerText(),
    ).toBe('127');

    // check default search entry index
    expect(await this.searchResultEntryIndex()).toBe(2);

    // click next and check next search entry index
    await nextButton.click();
    await this.page.waitForTimeout(3000);
    expect(await this.searchResultEntryIndex()).toBe(5);

    // click previous and check next search entry index
    await prevButton.click();
    await this.page.waitForTimeout(3000);
    expect(await this.searchResultEntryIndex()).toBe(2);
  }

  async searchResultEntryIndex(): Promise<Number> {
    const itemCount = 10;
    const transcriptView = this.page.locator('transcript-view');
    const entries = await transcriptView.locator('transcript-entry').all();

    let index = 0;
    while (index !== itemCount) {
      const searchResult = await entries[index].getAttribute('issearchresult');
      const selected = await entries[index].getAttribute('isselected');
      if (searchResult !== null && selected !== null) {
        return index;
      }

      index++;
    }

    return 0;
  }
}
