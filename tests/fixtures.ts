import { test as base } from '@playwright/test';

import { SearchPage } from './pageObjects/search-page';

type PageFixtures = {
  searchPage: SearchPage;
};

export const test = base.extend<PageFixtures>({
  searchPage: async ({ page }, use) => {
    // Set up the fixture.
    const searchPage = new SearchPage(page);
    await searchPage.visit();
    await searchPage.queryFor('cats');

    await page.route(/(analytics|fonts)/, (route) => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(searchPage);

    // Clean up the fixture.
    await page.close();
  },
});

export { expect } from '@playwright/test';
