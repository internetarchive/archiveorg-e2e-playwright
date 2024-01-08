import { type Page, type Locator, expect } from '@playwright/test';

export class CollectionFacets {
  
  readonly page: Page;
  readonly collectionFacets: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.collectionFacets = page.locator('collection-facets');
  }

  async checkFacetGroups() {
    const facetsContainer = this.collectionFacets.locator('#container');
    const facetGroups = facetsContainer.locator('section.facet-group');
    const headerTitles = facetsContainer.locator('h3');

    await this.collectionFacets.count();

    // assert facet group header count
    expect(await facetGroups.count()).toEqual(8);
    expect(await headerTitles.count()).toEqual(8);
  }

}
