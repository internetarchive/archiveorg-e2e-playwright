import { type Page, type Locator, expect } from '@playwright/test';

export class CollectionFacets {
  readonly page: Page;
  readonly collectionFacets: Locator;
  readonly resultsTotal: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.collectionFacets = page.locator('collection-facets');
    this.resultsTotal = page.locator('#facets-header-container #results-total');
  }

  async checkResultCount() {
    await expect(this.page.getByText('Searching')).toBeVisible();
    await expect(this.resultsTotal).toBeVisible();
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
