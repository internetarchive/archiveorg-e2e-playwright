import { type Page, Locator, expect } from '@playwright/test';

export class BookReader {
  readonly page: Page;

  readonly iaBookTheater: Locator;
  readonly bookReaderShell: Locator;
  readonly brContainer: Locator;
  readonly brFooter: Locator;

  readonly brLeft: Locator;
  readonly brRight: Locator;
  readonly brFlipNext: Locator;
  readonly brFlipPrev: Locator;

  readonly brZoomIn: Locator;
  readonly brZoomOut: Locator;

  readonly brOnePage: Locator;
  readonly brTwoPage: Locator;
  readonly brThumb: Locator;
  readonly brFullScreen: Locator;
  readonly brReadAloud: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.bookReaderShell = this.page.locator('#BookReader');
    this.brContainer = this.bookReaderShell.locator('.BRcontainer');
    this.brFooter = this.bookReaderShell.locator('.BRfooter');

    this.brFlipPrev = this.brFooter.locator('.BRicon.book_left.book_flip_prev');
    this.brFlipNext = this.brFooter.locator(
      '.BRicon.book_right.book_flip_next',
    );

    this.brZoomIn = this.brFooter.locator('.BRicon.zoom_in');
    this.brZoomOut = this.brFooter.locator('.BRicon.zoom_out');

    this.brOnePage = this.brFooter.locator('.BRicon.onepg');
    this.brTwoPage = this.brFooter.locator('.BRicon.twopg');
    this.brThumb = this.brFooter.locator('.BRicon.thumb');
    this.brFullScreen = this.brFooter.locator('.BRicon.full');
    this.brReadAloud = this.brFooter.locator('.BRicon.read');
  }

  async assertNavigationElements() {
    // flipping
    await expect(this.brFlipPrev).toBeVisible();
    await expect(this.brFlipNext).toBeVisible();
    // zoom elements
    await expect(this.brZoomIn).toBeVisible();
    await expect(this.brZoomOut).toBeVisible();
    // view modes
    await expect(this.brOnePage).toBeVisible();
    await expect(this.brTwoPage).toBeVisible();
    await expect(this.brThumb).toBeVisible();
    await expect(this.brFullScreen).toBeVisible();
    await expect(this.brReadAloud).toBeVisible();
  }
}
