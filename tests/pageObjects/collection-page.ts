import { type Page, type Locator, expect } from '@playwright/test';

import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

const PAGE_TIMEOUT = 3000;

export class CollectionPage {
  readonly url: string = 'https://archive.org/details';
  readonly page: Page;

  readonly pageHeader: Locator;
  readonly pageTabs: Locator;

  public constructor(page: Page) {
    this.page = page;

    this.pageHeader = page.locator('#page-header');
    this.pageTabs = page.locator('#page-container > tab-manager > div.tab-manager-container > nav.tabs-row > ul');
  }

  async visit (collection: string) {
    await this.page.goto(`${this.url}/${collection}`);
  } 

  async checkCollectionThumbnail() {
    await expect(this.page.locator('#top-matter > div.thumbnail-frame')).toBeVisible();
  }

  async checkCollectionSummary() {
    await expect(this.page.locator('#title-summary-container')).toBeVisible();
  }

  async checkCollectionActionBar() {
    await expect(this.page.locator('#action-bar-spacing > action-bar')).toBeVisible();
  }

  async checkCollectionPageTabs() {
    await expect(this.pageTabs).toBeVisible();
    expect(await this.pageTabs.locator('li').count()).toBe(3);
  }
}
