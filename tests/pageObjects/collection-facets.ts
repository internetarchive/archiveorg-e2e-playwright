import { type Page, type Locator, expect } from '@playwright/test';

import { FacetGroupLabel, FacetType } from '../models';

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
    await this.page.waitForTimeout(1000);

    const facetGroups = this.collectionFacets.locator('facets-template');
    expect(await facetGroups.count()).toEqual(7);
  }

  async selectFacetByGroup(group: FacetGroupLabel, facetLabel: string, facetType: FacetType) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const facetContent = await this.getFacetGroupContainer(group);
    if (facetContent) {
      if (facetType === 'positive') {
        const facetRow = facetContent.getByRole('checkbox', { name: facetLabel });
        await facetRow.check();
        return;
      }

      if (facetType === 'negative') {
        const facetRows = await facetContent.locator('facets-template > div.facets-on-page facet-row').all();
        if (facetRows.length !== 0) {
          for (let x = 0; x < facetRows.length; x++) {
            const facetRowLabel = facetRows[x].locator('div.facet-row-container > div.facet-checkboxes > label');
            const facetRowTitle = await facetRowLabel.getAttribute('title');
            if (facetRowTitle === `Hide mediatype: ${facetLabel}`) {
              await facetRowLabel.click();
              return;
            }
          }
        }
      }
    }
  }

  async clickMoreInFacetGroup(group: FacetGroupLabel) {
    const facetContent = await this.getFacetGroupContainer(group);
    if (facetContent) {
      const btnMore = facetContent.locator('button');
      await btnMore.click();
    }
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

  async fillUpYearFilters (startDate: string, endDate: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    // #container > section:nth-child(1) > histogram-date-range #inputs
    // console.log('start: ', startDate, ' endDate: ', endDate);
    // const facetGroup = this.collectionFacets.locator('#container > section:nth-child(1)');
    // getByRole('region', { name: 'Year Published range filter' })
    // getByLabel('Maximum date:')
    // getByLabel('Minimum date:')
    // console.log('histo: ', await facetGroup.innerHTML());
    const histogramContainer = this.page.locator('histogram-date-range');
    console.log('histo: ', await histogramContainer.innerHTML());

  }

  async getFacetGroupContainer(group: FacetGroupLabel) {
    const facetGroups = await this.collectionFacets.locator('#container > section.facet-group').all();
    
    for(let i = 0; i < facetGroups.length; i++) {
      const facetHeader = await facetGroups[i].getAttribute('aria-labelledby');
      if (facetHeader === group) {
        return facetGroups[i].locator('div.facet-group-content');
      }
    }
  }

}
