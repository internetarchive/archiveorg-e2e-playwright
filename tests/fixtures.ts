import { test as base } from '@playwright/test';

import { CollectionPage } from './page-objects/collection-page';
import { MusicPage } from './page-objects/music-page';
import { SearchPage } from './page-objects/search-page';

type PageFixtures = {
  musicPage: MusicPage;
  collectionPage: CollectionPage;
  searchPage: SearchPage;
};

export const test = base.extend<PageFixtures>({
  musicPage: async ({ page }, use) => {
    // Set up the fixture.
    const musicPage = new MusicPage(page);

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(musicPage);

    // Clean up the fixture.
    await page.close();
  },
  collectionPage: async ({ page }, use) => {
    // Set up the fixture.
    const collectionPage = new CollectionPage(page);
    await collectionPage.visit('oldtimeradio');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(collectionPage);

    // Clean up the fixture.
    await page.close();
  },
  searchPage: async ({ page }, use) => {
    // Set up the fixture.
    const searchPage = new SearchPage(page);
    await searchPage.visit();
    await searchPage.queryFor('cats');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(searchPage);

    // Clean up the fixture.
    await page.close();
  },
});

export { expect } from '@playwright/test';
