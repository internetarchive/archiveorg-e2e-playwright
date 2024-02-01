import { type Page, type Locator, expect } from '@playwright/test';

import { FacetGroupLocatorLabel, FacetType } from '../models';

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

  async displaysResultCount() {
    await expect(this.resultsTotal).toBeVisible();
  }

  async assertSearchFacetGroupCount() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const facetGroups = this.collectionFacets.locator('facets-template');
    expect(await facetGroups.count()).toEqual(7);
  }

  async assertCollectionFacetGroupCount() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const facetGroups = this.collectionFacets.locator('facets-template');
    expect(await facetGroups.count()).toEqual(6);
  }

  async selectFacetByGroup(
    group: FacetGroupLocatorLabel,
    facetLabel: string,
    facetType: FacetType
  ) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    const facetContent = await this.getFacetGroupContainer(group);
    if (facetContent) {
      if (facetType === 'positive') {
        const facetRow = facetContent.getByRole('checkbox', {
          name: facetLabel
        });
        await facetRow.check();
        return;
      }

      if (facetType === 'negative') {
        const facetRows = await facetContent
          .locator('facets-template > div.facets-on-page facet-row')
          .all();
        if (facetRows.length !== 0) {
          for (let x = 0; x < facetRows.length; x++) {
            const facetRowLabel = facetRows[x].locator(
              'div.facet-row-container > div.facet-checkboxes > label'
            );
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

  async clickMoreInFacetGroup(group: FacetGroupLocatorLabel) {
    const facetContent = await this.getFacetGroupContainer(group);
    if (facetContent) {
      const btnMore = facetContent.locator('button');
      await btnMore.click();
    }
  }

  async selectFacetsInModal(facetLabels: string[]) {
    await this.page.waitForLoadState();

    const btnApplyFilters = this.moreFacetsContent.locator(
      '#more-facets > div.footer > button.btn.btn-submit'
    );
    for (let i = 0; i < facetLabels.length; i++) {
      // wait for the promise to resolve before advancing the for loop
      const facetRow = this.moreFacetsContent
        .locator('#more-facets')
        .getByRole('checkbox', { name: facetLabels[i] });
      await facetRow.check();
    }
    await btnApplyFilters.click();
  }

  async fillUpYearFilters(startDate: string, endDate: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    const facetContent = await this.getFacetGroupContainer(FacetGroupLocatorLabel.DATE);
    if (facetContent) {
      const datePickerContainer = facetContent.locator(
        'histogram-date-range #container > div.inner-container > #inputs'
      );
      const minYear = datePickerContainer.locator('input#date-min');
      const maxYear = datePickerContainer.locator('input#date-max');

      await minYear.fill(startDate);
      await maxYear.fill(endDate);
      await maxYear.press('Enter');
    }
  }

  async getFacetGroupContainer(group: FacetGroupLocatorLabel): Promise<Locator | null> {
    const facetGroups = await this.collectionFacets
      .locator('#container > section.facet-group')
      .all();

    for (let i = 0; i < facetGroups.length; i++) {
      const facetHeader = await facetGroups[i].getAttribute('aria-labelledby');
      if (facetHeader === group) {
        return group === FacetGroupLocatorLabel.DATE
          ? facetGroups[i]
          : facetGroups[i].locator('div.facet-group-content');
      }
    }
    return null;
  }
}
