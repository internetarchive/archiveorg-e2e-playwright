import { type Page, Locator, expect } from '@playwright/test';
import { SearchPage } from './search-page';

export class HomePage {
  readonly page: Page;

  readonly searchPage: SearchPage;

  public constructor(page: Page) {
    this.page = page;

    this.searchPage = new SearchPage(page);
  }

  async validatePageElements() {
    // WBM widget is present
    await expect(this.page.locator('ia-wayback-search')).toBeVisible();

    // Search box is present
    await expect(this.page.locator('collection-search-input')).toBeVisible();

    // Archive news is present
    await expect(this.page.locator('#announcements > hero-block-announcements')).toBeVisible();

    // Mediatype icons present above search box
    await expect(this.page.locator('#icon-block-container > home-page-hero-block-icon-bar')).toBeVisible();

    // New to the Archive carousel is present
    await expect(this.page.locator('home-page-onboarding')).toBeVisible();

    // Top Collections section is present and populated
    await expect(this.page.locator('infinite-scroller')).toBeVisible();
    expect((await this.page.locator('infinite-scroller > #container > .cell-container').all()).length).toBeGreaterThan(1);

    // Terms of Service footer is present
    await expect(this.page.locator('footer > app-footer')).toBeVisible();
  }

  async searchQueryFor(query: string) {
    await this.searchPage.queryFor(query);
  }



}
