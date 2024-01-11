import { type Page, type Locator, expect } from '@playwright/test';

export class CollectionFacets {
  
  readonly page: Page;
  readonly collectionFacets: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.collectionFacets = page.locator('collection-facets');
  }

  async checkResultCount() {
    await expect(this.page.getByText('Searching')).toBeVisible();
    await this.page.waitForTimeout(5000);
    await expect(this.page.getByText('Results', { exact: true })).toBeVisible();
  }

  async checkFacetGroups() {
    const facetsContainer = this.collectionFacets.locator('#container');
    const facetGroups = facetsContainer.locator('section.facet-group');
    const headerTitles = facetsContainer.locator('h3');

    // assert facet group header count
    expect(await facetGroups.count()).toEqual(8);
    expect(await headerTitles.count()).toEqual(8);
  }

}
