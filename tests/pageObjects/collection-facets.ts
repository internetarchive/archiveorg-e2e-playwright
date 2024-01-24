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

  async assertFacetGroupCount() {
    await this.page.waitForLoadState('networkidle');

    const facetGroups = this.collectionFacets.locator('facets-template');
    expect(await facetGroups.count()).toEqual(7);
  }

  async clickFacetInMediaType(facetLabel: string) {
    const facetContainer = this.collectionFacets.locator('#container > section:nth-child(2) > div.facet-group-content');
    const facetRow = facetContainer.getByRole('checkbox', { name: facetLabel });

    await facetRow.check();
  }

  async clickMoreMediaTypeFacetGroup() {
    const btnMore = this.collectionFacets.locator('#container > section:nth-child(2) > div.facet-group-content > button');
    await btnMore.click();
  }

  async selectFacetsInModal(facetLabels: string[]) {
    await this.page.waitForLoadState();

    const btnApplyFilters = this.moreFacetsContent.locator('#more-facets > div.footer > button.btn.btn-submit');
    for (let i = 0; i < facetLabels.length; i++) {
      // wait for the promise to resolve before advancing the for loop
      const facetRow = this.moreFacetsContent.locator('#more-facets').getByRole('checkbox', { name: facetLabels[i] });
      await facetRow.check();
    }
    await btnApplyFilters.click();
  }

  async selectMediaTypeNegativeFacet(facetLabel: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    console.log('facetLabel: ', facetLabel);
    const facetContainer = this.collectionFacets.locator('#container > section:nth-child(2) > div.facet-group-content');
    const facetRows = await facetContainer.locator('facets-template > div.facets-on-page facet-row').all();

    let index = 0;
    while (index !== facetRows.length) {
      const facetRowLabel = facetRows[index].locator('div.facet-row-container > div.facet-checkboxes > label');
      const facetLabelTitle = await facetRowLabel.getAttribute('title');
      console.log('row: ', facetLabelTitle);
      if (facetLabelTitle === `Hide mediatype: ${facetLabel}`) {
        await facetRowLabel.click();
        console.log('click facetRow')
        break;
      } else {
        index++;
      }
    }
  }

}
