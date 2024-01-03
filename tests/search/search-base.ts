import { expect, Page } from "@playwright/test";

import { SearchPage } from './search-page';

export async function navigateThruInfiniteScrollerViewModes (page: Page) {
  const searchPage = new SearchPage(page);

  const sortBarSection = searchPage.sortFilterBar;
  const displayStyleSelector = sortBarSection.locator('div#display-style-selector');
  const displayStyleSelectorOptions = displayStyleSelector.locator('ul > li');

  // check if default grid view mode
  expect(await expect(searchPage.infiniteScroller).toHaveClass(/grid/));
  await expect(searchPage.infiniteScroller.locator('item-tile').first()).toBeVisible();
  await expect(searchPage.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
  await expect(searchPage.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();

  // switch to list-detail view mode
  await displayStyleSelectorOptions.nth(1).click();
  await expect(searchPage.infiniteScroller).toHaveClass(/list-detail/);
  await expect(searchPage.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
  await expect(searchPage.infiniteScroller.locator('tile-list').first()).toBeVisible();
  await expect(searchPage.infiniteScroller.locator('tile-list-compact').first()).not.toBeVisible();

  // switch to list-compact view mode
  await displayStyleSelectorOptions.nth(2).click();
  await expect(searchPage.infiniteScroller).toHaveClass(/list-compact/);
  await expect(searchPage.infiniteScroller.locator('item-tile').first()).not.toBeVisible();
  await expect(searchPage.infiniteScroller.locator('tile-list').first()).not.toBeVisible();
  await expect(searchPage.infiniteScroller.locator('tile-list-compact').first()).toBeVisible();
}
