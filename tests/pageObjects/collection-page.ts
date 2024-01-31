import { type Page, type Locator, expect } from '@playwright/test';

import { SearchPage } from './search-page';
import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

export class CollectionPage {
  readonly url: string = 'https://archive.org/details';
  readonly page: Page;

  readonly pageHeader: Locator;
  readonly pageSummary: Locator;
  readonly pageTabs: Locator;

  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly searchPage: SearchPage;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.pageHeader = page.locator('#page-header');
    this.pageSummary = page.locator('#title-summary-container');
    this.pageTabs = page.locator(
      '#page-container > tab-manager > div.tab-manager-container > nav.tabs-row > ul'
    );

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.searchPage = new SearchPage(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit(collection: string) {
    await this.page.goto(`${this.url}/${collection}`);
    await this.page.waitForLoadState('load');
  }

  async checkCollectionThumbnail() {
    await expect(this.page.locator('#top-matter > div.thumbnail-frame')).toBeVisible();
  }

  async checkCollectionSummary() {
    await expect(this.pageSummary).toBeVisible();
  }

  async checkCollectionActionBar() {
    await expect(this.page.locator('#action-bar-spacing > action-bar')).toBeVisible();
  }

  async checkCollectionPageTabs() {
    await expect(this.pageTabs).toBeVisible();
    expect(await this.pageTabs.locator('li').count()).toBe(3);
  }

  async clickMoreBtnFromSummary() {
    await this.pageSummary.locator('#more-btn').click();
  }

  async checkAboutTabPage() {
    await expect(this.page.locator('collection-about')).toBeVisible();
  }

  async checkForumTabPage() {
    await expect(this.page.locator('#forum-container')).toBeVisible();

    const newPostButtonLocator = '#forum-container > div > h1 > span > a > span';
    const rssButtonLocator = '#forum-container > div > h1 > a.label.label-success';
    await expect(this.page.locator(newPostButtonLocator)).toBeVisible();
    await expect(this.page.locator(rssButtonLocator)).toBeVisible();
  }

  async checkCollectionTabPage() {
    await expect(this.page.locator('#collection-browser-container')).toBeVisible();
  }

  async clickCollectionTab(name: string) {
    await this.pageTabs.getByRole('link', { name }).click();
  }
}
