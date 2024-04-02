import { type Page, type Locator, expect } from '@playwright/test';

import { SearchPage } from './search-page';
import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

export class ProfilePage {
  readonly page: Page;

  readonly pageSummary: Locator;
  readonly pageTabs: Locator;

  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly searchPage: SearchPage;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.pageSummary = page.locator('#user-summary-container');
    this.pageTabs = page.locator(
      '#page-container > tab-manager > div.tab-manager-container > nav.tabs-row > ul',
    );

    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.searchPage = new SearchPage(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit(userid: string) {
    await this.page.goto(`/details/@${userid}`);
    await this.page.waitForLoadState('load', { timeout: 60000 });
  }

  async clickProfileTab(name: string) {
    await this.pageTabs.getByRole('link', { name }).click();
  }

  async validatePageHeaderElements() {
    await expect(this.page.locator('#profile-header')).toBeVisible();
    await expect(
      this.page.locator('#top-matter > div.thumbnail-frame'),
    ).toBeVisible();
    await expect(this.pageSummary).toBeVisible();
    await expect(this.page.locator('action-bar')).toBeVisible();
  }

  async validateUnownedProfilePageTabs() {
    await expect(this.pageTabs).toBeVisible({ timeout: 60000 });
    // Only the six basic tabs when viewing another patron's profile.
    await Promise.all([
      expect(this.pageTabs.locator('a[data-tab-id="uploads"]')).toBeVisible(),
      expect(this.pageTabs.locator('a[data-tab-id="lists"]')).toBeVisible(),
      expect(this.pageTabs.locator('a[data-tab-id="posts"]')).toBeVisible(),
      expect(this.pageTabs.locator('a[data-tab-id="reviews"]')).toBeVisible(),
      expect(
        this.pageTabs.locator('a[data-tab-id="collections"]'),
      ).toBeVisible(),
      expect(
        this.pageTabs.locator('a[data-tab-id="web-archive"]'),
      ).toBeVisible(),
    ]);
  }

  async validateOwnProfilePageTabs() {
    // If viewing *your own* profile, the Loans tab appears too, in addition to all the others.
    await Promise.all([
      this.validateUnownedProfilePageTabs(),
      expect(this.pageTabs.locator('a[data-tab-id="loans"]')).toBeVisible(),
    ]);
  }

  async validateClickedTabAppeared(tabName: string) {
    const pageTabsText = {
      uploads: 'UPLOADS',
      lists: 'LISTS',
      posts: 'POSTS',
      reviews: 'REVIEWS',
      collections: 'COLLECTIONS',
      'web-archive': 'WEB ARCHIVES',
    };

    await expect(this.page.locator(`div[slot="${tabName}"]`)).toBeVisible({
      timeout: 1000,
    });
    await expect(
      await this.pageTabs.locator('li.tab.active').innerText(),
    ).toContain(pageTabsText[tabName]);
  }

  async validateResultCountElement(tabName: string) {
    const resultCountElement = this.page.locator(
      `div[slot="${tabName}"] collection-browser #results-total`,
    );
    await expect(resultCountElement).toBeVisible({ timeout: 100 });
  }

  async validateResultForPostsTab() {
    const resultElement = this.page.locator(
      'div[slot="posts"] user-forum-posts h2',
    );
    expect(await resultElement.innerText()).toContain('Posts by');
  }
}
