import { type Page, type Locator, expect } from '@playwright/test';

import { CollectionBrowser } from './collection-browser';
import { CollectionFacets } from './collection-facets';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

export class CollectionPage {
  readonly page: Page;

  readonly pageSummary: Locator;
  readonly pageTabs: Locator;

  readonly collectionBrowser: CollectionBrowser;
  readonly collectionFacets: CollectionFacets;
  readonly infiniteScroller: InfiniteScroller;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.pageSummary = page.locator('#title-summary-container');
    this.pageTabs = page.locator(
      '#page-container > tab-manager > div.tab-manager-container > nav.tabs-row > ul',
    );

    this.collectionBrowser = new CollectionBrowser(this.page);
    this.collectionFacets = new CollectionFacets(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit(collection: string) {
    await this.page.goto(collection);
  }

  async clickCollectionTab(tabName: string) {
    const elem = this.page.locator('div.tab-manager-container > nav > ul > li');
    await elem.filter({ hasText: tabName }).click();
  }

  async clickMoreBtnFromSummary() {
    await expect(this.page.locator('#page-header')).toBeVisible();
    await this.pageSummary.getByTestId('more-link-btn').click();
  }

  async validatePageHeaderElements() {
    await expect(this.page.locator('#page-header')).toBeVisible();
    await expect(
      this.page.locator('#top-matter > div.thumbnail-frame'),
    ).toBeVisible();
    await expect(this.pageSummary).toBeVisible();
    await expect(this.page.locator('action-bar')).toBeVisible();
  }

  async validateCollectionPageTabs() {
    await expect(this.pageTabs).toBeVisible();
    // this could cause an error in some detailsPage that doesn't have Forum tab like ytjdradio
    // should be tackled in a different task
    await expect(this.pageTabs.getByLabel('Collection', { exact: true })).toBeVisible();
    await expect(this.pageTabs.getByLabel('Forum')).toBeVisible();
    await expect(this.pageTabs.getByLabel('About')).toBeVisible();
  }

  async validateTabPage(tab: string) {
    await this.checkLocatorInnerHtml(this.pageTabs, 'loading-placeholder-row');

    if(tab === 'About') {
      await this.validateAboutTabPage();
    } else if (tab === 'Collection') {
      await this.validateCollectionTabPage();
    } else if (tab === 'Forum') {
      await this.validateForumTabPage();
    }
  }

  async validateAboutTabPage() {
    await expect(
      this.page.getByRole('heading', { name: 'Activity' }),
    ).toBeVisible();
    // ytjdradio details page doesn't have forum posts, commenting this part for now
    // await expect(this.page.getByRole('button', { name: 'forum posts.' })).toBeVisible();
    await expect(
      this.page.getByRole('heading', { name: 'Collection Info' }),
    ).toBeVisible();
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
    await expect(forumContainer).toBeVisible();
    await expect(newPostButtonLocator).toBeVisible();
    await expect(rssButtonLocator).toBeVisible();
  }

  async validateCollectionTabPage() {
    expect(await this.pageTabs.locator('li.tab.active').innerText()).toContain(
      'COLLECTION',
    );
    await expect(
      this.page.locator('#collection-browser-container'),
    ).toBeVisible();
  }

  async checkLocatorInnerHtml(locator: Locator, elem: string) {
    const innerHtmlContent = await locator.innerHTML();
    if (innerHtmlContent.includes(elem)) {
      await this.checkLocatorInnerHtml(locator, elem); // Recursive call
    } else {
      return; // Exit the function when the condition is met
    }
  }
}
