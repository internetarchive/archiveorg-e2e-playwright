import { type Page, type Locator, expect } from '@playwright/test';

export class CollectionFacets {
  readonly page: Page;
  readonly collectionFacets: Locator;
  readonly resultsTotal: Locator;
  readonly modalManager: Locator;
  readonly moreFacetsContent: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.collectionFacets = page.locator('collection-facets');
    this.resultsTotal = page.locator('#facets-header-container #results-total');

    this.modalManager = page.locator('modal-manager');
    this.moreFacetsContent = page.locator('more-facets-content');
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

  async clickMoreMediaTypeFacet() {
    const btnMore = this.collectionFacets.locator('#container > section:nth-child(2) > div.facet-group-content > button');
    await btnMore.click();
  }

  async selectFacetTitleInMoreFacetsModal(facetLabel: string) {
    await this.page.waitForLoadState();

    const btnApplyFilters = this.moreFacetsContent.locator('#more-facets > div.footer > button.btn.btn-submit');
    const facetRow = this.moreFacetsContent.locator('#more-facets').getByRole('checkbox', { name: facetLabel });

    await facetRow.check();
    await btnApplyFilters.click();
  }



}
