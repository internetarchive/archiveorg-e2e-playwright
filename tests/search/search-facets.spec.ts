import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const facetHeaderTitles = [
  'Year Published',
  'Media Type',
  'Availability',
  'Year',
  'Subject',
  'Collection',
  'Creator',
  'Language',
]

test('Search Page - facets load properly', async ({ page }) => {
	await page.goto('https://archive.org/search?query=cats');
	await page.waitForTimeout(3000);

  const leftColumn = page.locator('div#left-column.column');
  const facetsHeaderContainer = page.locator('div#facets-header-container');
  const facetsContainer = page.locator('div#facets-container');
  const facetGroups = facetsContainer.locator('section.facet-group');
  const headerTitles = facetsContainer.locator('h3');

  expect(await leftColumn.count()).toEqual(1);
  expect(await facetsHeaderContainer.count()).toEqual(1);
  expect(await facetsContainer.count()).toEqual(1);
  expect(await facetGroups.count()).toEqual(8);
  expect(await headerTitles.count()).toEqual(8);

  // facet-groups header titles and components -> checked by element group
  for (let i = 0; i < 7; ++i) {
    const nthTitle = headerTitles.nth(i);
    const nthComponent = facetGroups.nth(i);
    expect(await nthTitle.textContent()).toContain(facetHeaderTitles[i]);

	  await page.waitForTimeout(3000);
    // first element from the group should be the `histogram-date-range` component
    // otherwise, it's a `facets-template` component
    if (i === 0) {
      const histogramDateRangeComponent = nthComponent.locator('histogram-date-range');
      expect(await histogramDateRangeComponent.count()).toEqual(1);
    } else {
      const facetsTemplateComponent = nthComponent.locator('facets-template');
      expect(await facetsTemplateComponent.count()).toEqual(1);
    }
  }

});
