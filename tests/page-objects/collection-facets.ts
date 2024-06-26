import { type Page, type Locator, expect } from '@playwright/test';

import {
  CollectionFacetGroupHeader,
  FacetGroupFilterHeaderEnum,
  FacetGroupLocatorLabel,
  FacetType,
  SearchFacetGroupHeader,
} from '../models';

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
    await expect(this.resultsTotal).toBeVisible({ timeout: 60000 });
  }

  async getFacetGroupByHeadingName(headerName: string) {
    await expect(this.page.getByRole('heading', { name: headerName })).toBeVisible();
  }

  async assertSearchFacetGroupCount() {
    let count = 0;
    for await (const name of SearchFacetGroupHeader) {
      await this.getFacetGroupByHeadingName(name);
      count++;
    }
    expect(count).toEqual(8);
  }

  async assertCollectionFacetGroupCount() {
    let count = 0;
    for await (const name of CollectionFacetGroupHeader) {
      await this.getFacetGroupByHeadingName(name);
      count++;
    }
    expect(count).toEqual(8);
  }

  async assertListFacetGroupCount() {
    const facetGroups = this.collectionFacets.locator('facets-template');
    expect(await facetGroups.count()).toEqual(7);
  }

  async assertDatePickerVisible() {
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });

    const datePicker = await this.getFacetGroupContainer(
      FacetGroupLocatorLabel.DATE,
      FacetGroupFilterHeaderEnum.YEAR,
    );
    expect(await datePicker?.innerText()).toContain('Year');
  }

  async selectFacetByGroup(
    group: FacetGroupLocatorLabel,
    header: FacetGroupFilterHeaderEnum,
    facetLabel: string,
    facetType: FacetType,
  ) {
    const facetContent = await this.getFacetGroupContainer(group, header);
    const facetContentInnerHTML = await facetContent?.innerHTML();

    if (facetContentInnerHTML?.includes('facets-template')) {
      const facetRows = await facetContent
        ?.locator('facets-template > div.facets-on-page facet-row')
        .all();
      if (facetRows && facetRows.length !== 0) {
        for (let x = 0; x < facetRows.length; x++) {
          const facetRowLocator = facetRows[x].locator(
            'div.facet-row-container > div.facet-checkboxes',
          );
          const facetRowInput = facetRowLocator
            .locator('input[type="checkbox"]')
            .first();
          const facetRowLabel = facetRowLocator
            .locator('label.hide-facet-icon')
            .first();
          const facetRow =
            facetType === 'positive' ? facetRowInput : facetRowLabel;
          const facetRowId =
            facetType === 'positive'
              ? await facetRow.getAttribute('id')
              : await facetRow.getAttribute('title');

          if (facetRowId?.includes(facetLabel)) {
            await facetRow.click();
            return;
          }
        }
      }
    }
  }

  async clickMoreInFacetGroup(
    group: FacetGroupLocatorLabel,
    header: FacetGroupFilterHeaderEnum,
  ) {
    const facetContent = await this.getFacetGroupContainer(group, header);
    if (facetContent) {
      const btnMore = facetContent.locator('button');
      await btnMore.click();
    }
  }

  async selectFacetsInModal(facetLabels: string[]) {
    // UI is loading -> ia-activity-indicator is displayed
    await this.checkLocatorInnerHtml(this.moreFacetsContent, 'ia-activity-indicator');

    const btnApplyFilters = this.moreFacetsContent.locator(
      '#more-facets > div.footer > button.btn.btn-submit',
    );
    for (let i = 0; i < facetLabels.length; i++) {
      // wait for the promise to resolve before advancing the for loop
      const facetRow = this.moreFacetsContent
        .locator('#more-facets')
        .getByRole('checkbox', { name: facetLabels[i] });
      await facetRow.check({ timeout: 5000 });
    }
    await btnApplyFilters.click();
  }

  async fillUpYearFilters(startDate: string, endDate: string) {
    const facetContent = await this.getFacetGroupContainer(
      FacetGroupLocatorLabel.DATE,
      FacetGroupFilterHeaderEnum.YEAR_PUBLISHED,
    );
    if (facetContent) {
      const datePickerContainer = facetContent.locator(
        'histogram-date-range #container > div.inner-container > #inputs',
      );
      const minYear = datePickerContainer.locator('input#date-min');
      const maxYear = datePickerContainer.locator('input#date-max');

      await minYear.fill(startDate);
      await maxYear.fill(endDate);
      await maxYear.press('Enter');
    }
  }

  async getFacetGroupContainer(
    group: FacetGroupLocatorLabel,
    header: FacetGroupFilterHeaderEnum,
  ): Promise<Locator | null> {
    const facetHeader = this.page.getByLabel(header);
    // UI is loading -> facet-tombstone-row is displayed
    await this.checkLocatorInnerHtml(facetHeader, 'facet-tombstone-row');

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

  async checkLocatorInnerHtml(locator: Locator, elem: string) {
    const innerHtmlContent = await locator.innerHTML();
    if (innerHtmlContent.includes(elem)) {
      await this.checkLocatorInnerHtml(locator, elem); // Recursive call
    } else {
      return; // Exit the function when the condition is met
    }
  }

}