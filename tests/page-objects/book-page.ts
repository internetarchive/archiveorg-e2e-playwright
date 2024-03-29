import { type Page, Locator, expect } from '@playwright/test';

import { BookPageViewMode } from '../models';
import { BookReader } from './book-reader';

const PAGE_FLIP_WAIT_TIME = 1000;

export class BookPage {
  readonly page: Page;

  readonly bookReaderShell: Locator;
  readonly brContainer: Locator;
  readonly brFooter: Locator;

  readonly bookReader: BookReader;

  public constructor(page: Page) {
    this.page = page;

    this.bookReader = new BookReader(this.page);
    this.bookReaderShell = this.bookReader.bookReaderShell;
    this.brContainer = this.bookReader.brContainer;
    this.brFooter = this.bookReader.brFooter;
  }

  // Check URL page parameter in # and path
  async isPageInUrl() {
    const hash = await this.page.evaluate(() => window.location.hash);
    const href = await this.page.evaluate(() => window.location.href);
    if (hash) {
      return hash.indexOf('#page/') > -1;
    } else {
      return href.indexOf('/page/') > -1;
    }
  }

  // Check URL mode parameter in # and path
  async isModeInUrl(mode: BookPageViewMode) {
    const hash = await this.page.evaluate(() => window.location.hash);
    const href = await this.page.evaluate(() => window.location.href);
    if (hash) {
      return hash.indexOf('/mode/' + mode) > -1;
    } else {
      return href.indexOf('/mode/' + mode) > -1;
    }
  }

  async assertUrlInitialParameters() {
    const pageHash = await this.page.evaluate(() => window.location.hash);
    const pageUrl = await this.page.evaluate(() => window.location.href);

    // Initial URL has no params
    expect(pageHash).toEqual('');
    // Initial URL has no page/ mode/
    expect(pageUrl).not.toEqual('#page/');
    expect(pageUrl).not.toContain('/page/');
    expect(pageUrl).not.toContain('/mode/');
  }

  async assertPageBoundingBox() {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });

    const brShellBox = await this.bookReaderShell.boundingBox();
    const brContainerBox = await this.brContainer.boundingBox();

    // images do not get cropped vertically
    expect(brContainerBox?.height).toBeLessThanOrEqual(
      Number(brShellBox?.height),
    );
    // images do not get cropped horizontally
    expect(brContainerBox?.width).toBeLessThanOrEqual(
      Number(brShellBox?.width),
    );
  }

  async assertBookPageChange() {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });

    // Go to next page, so we can go previous if at front cover
    await this.bookReader.brFlipNext.click();
    await this.page.waitForTimeout(PAGE_FLIP_WAIT_TIME);
    await this.bookReader.brFlipNext.click();
    await this.page.waitForTimeout(PAGE_FLIP_WAIT_TIME);

    const onLoadBrState = this.brContainer.nth(0);
    const initialImages = onLoadBrState.locator('img');
    const origImg1Src = await initialImages.nth(0).getAttribute('src');
    const origImg2Src = await initialImages.nth(-1).getAttribute('src');

    await this.bookReader.brFlipPrev.click();
    await this.page.waitForTimeout(PAGE_FLIP_WAIT_TIME);

    const nextBrState = this.brContainer.nth(0);
    const prevImages = nextBrState.locator('img');
    const prevImg1Src = await prevImages.nth(0).getAttribute('src');
    const prevImg2Src = await prevImages.nth(-1).getAttribute('src');

    // we aren't showing the same image in both leaves
    expect(origImg1Src).not.toEqual(origImg2Src);

    // we are showing new pages
    expect(prevImg1Src).not.toEqual(origImg1Src);
    expect(prevImg1Src).not.toEqual(origImg2Src);
    expect(prevImg2Src).not.toEqual(origImg1Src);
    expect(prevImg2Src).not.toEqual(origImg2Src);

    // we aren't showing the same image in the new pages
    expect(prevImg1Src).not.toEqual(prevImg2Src);
  }

  async assertPageFlipUpdateUrlLocation() {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });

    // Page navigation creates params
    await this.bookReader.brFlipNext.click();
    await this.page.waitForTimeout(PAGE_FLIP_WAIT_TIME);
    expect(await this.isPageInUrl()).toEqual(true);
    expect(await this.isModeInUrl('2up')).toEqual(true);

    await this.bookReader.brFlipPrev.click();
    await this.page.waitForTimeout(PAGE_FLIP_WAIT_TIME);
    expect(await this.isPageInUrl()).toEqual(false);
    expect(await this.isModeInUrl('2up')).toEqual(true);
  }
}
