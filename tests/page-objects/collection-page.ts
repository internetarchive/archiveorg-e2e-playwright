import { type Page, type Locator, expect } from '@playwright/test';

import { SearchPage } from './search-page';
import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

export class CollectionPage {
  readonly page: Page;

  readonly pageSummary: Locator;
  readonly pageTabs: Locator;

  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly searchPage: SearchPage;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.pageSummary = page.locator('#title-summary-container');
    this.pageTabs = page.locator(
      '#page-container > tab-manager > div.tab-manager-container > nav.tabs-row > ul',
    );

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.searchPage = new SearchPage(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit(collection: string) {
    await this.page.goto(`/details/${collection}`);
    await this.page.waitForLoadState('load', { timeout: 60000 });
  }

  async clickCollectionTab(name: string) {
    await this.pageTabs.getByRole('link', { name }).click();
  }

  async clickMoreBtnFromSummary() {
    await this.pageSummary.locator('#more-btn').click();
  }

  async validatePageHeaderElements() {
    await expect(this.page.locator('#page-header')).toBeVisible({
      timeout: 60000,
    });
    await expect(
      this.page.locator('#top-matter > div.thumbnail-frame'),
    ).toBeVisible({ timeout: 60000 });
    await expect(this.pageSummary).toBeVisible({ timeout: 60000 });
    await expect(this.page.locator('action-bar')).toBeVisible({
      timeout: 60000,
    });
  }

  async validateCollectionPageTabs() {
    await expect(this.pageTabs).toBeVisible({ timeout: 60000 });
    expect(await this.pageTabs.locator('li').count()).toBe(3);
  }

  async validateAboutTabPage() {
    await expect(this.page.getByRole('heading', { name: 'Activity' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'reviews.' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'forum posts.' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Collection Info' })).toBeVisible();
    expect(await this.pageTabs.locator('li.tab.active').innerText()).toContain(
      'ABOUT',
    );
  }

  async validateForumTabPage() {
    const forumContainer = this.page.locator('#forum-container');
    const newPostButtonLocator = forumContainer.getByRole('link', {
      name: 'New Post',
    });
    const rssButtonLocator = forumContainer.getByRole('link', { name: 'RSS' });

    expect(await this.pageTabs.locator('li.tab.active').innerText()).toContain(
      'FORUM',
    );
    await expect(forumContainer).toBeVisible({ timeout: 60000 });
    await expect(newPostButtonLocator).toBeVisible({ timeout: 60000 });
    await expect(rssButtonLocator).toBeVisible({ timeout: 60000 });
  }

  async validateCollectionTabPage() {
    expect(await this.pageTabs.locator('li.tab.active').innerText()).toContain(
      'COLLECTION',
    );
    await expect(
      this.page.locator('#collection-browser-container'),
    ).toBeVisible({ timeout: 60000 });
  }
}
