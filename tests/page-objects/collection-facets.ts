import { type Page, type Locator, expect } from '@playwright/test';

import {
  CollectionFacetGroupHeader,
  FacetGroup,
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
    group: FacetGroup,
    facetLabel: string,
    facetType: FacetType,
  ) {
    const facetGroup = this.page.getByTestId(`facet-group-header-label-${group}`);
    await this.page.waitForTimeout(3000);
    const facetRows = await facetGroup.getByTestId(`facets-for-${group}`).locator('facet-row').all();

    for (const facetRow of facetRows) {
      const facetCheckbox = facetRow.locator('div.facet-row-container > div.facet-checkboxes');
      const rowCheck = facetType === 'positive' 
        ? facetCheckbox.getByTestId(`${group}:${facetLabel}-show-only`)
        : facetCheckbox.getByTestId(`${group}:${facetLabel}-negative`)
      const rowVisible = await rowCheck.isVisible();
      if (rowVisible) {
        await rowCheck.click();
        return;
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
    for (const facetLabel of facetLabels) {
      // wait for the promise to resolve before advancing the for loop
      const facetRow = this.moreFacetsContent
        .locator('#more-facets')
        .getByRole('checkbox', { name: facetLabel });
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

    for (const facetGroup of facetGroups) {
      const facetHeader = await facetGroup.getAttribute('aria-labelledby');
      if (facetHeader === group) {
        return group === FacetGroupLocatorLabel.DATE
          ? facetGroup
          : facetGroup.locator('div.facet-group-content');
      }
    }
    return null;
  }

  async getAllFacetRows(facetContent: Locator) {
    const rows = await facetContent
        ?.locator('facets-template div > facet-row')
        .all();
      
    if (rows?.length === 0) this.getAllFacetRows(facetContent)
    else return rows;
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
