import { test as base } from '@playwright/test';

import { CollectionPage } from './page-objects/collection-page';
import { MusicPage } from './page-objects/music-page';
import { SearchPage } from './page-objects/search-page';
import { HomePage } from './page-objects/home-page';
import { ProfilePage } from './page-objects/profile-page';
import { BookPage } from './page-objects/book-page';
import { DetailsPage } from './page-objects/details-page';
import { LendingBarAutoRenew } from './page-objects/lending-bar-auto-renew';
import { LoginPage } from './page-objects/login-page';

type PageFixtures = {
  lendingBarAutoRenew: LendingBarAutoRenew;
  detailsPage: DetailsPage;
  bookPage: BookPage;
  homePage: HomePage;
  musicPage: MusicPage;
  collectionPage: CollectionPage;
  searchPage: SearchPage;
  profilePage: ProfilePage;
  patronLoginPage: LoginPage;
  privsLoginPage: LoginPage;
  loginPage: LoginPage;
  profilePageUploads: ProfilePage;
};

export const test = base.extend<PageFixtures>({
  lendingBarAutoRenew: async ({ page }, use) => {
    // Set up the fixture.
    const lendingBarAutoRenew = new LendingBarAutoRenew(page);

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(lendingBarAutoRenew);

    // Clean up the fixture.
    await page.close();
  },
  detailsPage: async ({ page }, use) => {
    // Set up the fixture.
    const detailsPage = new DetailsPage(page);

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(detailsPage);

    // Clean up the fixture.
    await page.close();
  },
  bookPage: async ({ page }, use) => {
    // Set up the fixture.
    const bookPage = new BookPage(page);

    await page.goto('/details/theworksofplato01platiala');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(bookPage);

    // Clean up the fixture.
    await page.close();
  },
  homePage: async ({ page }, use) => {
    // Set up the fixture.
    const homePage = new HomePage(page);

    await page.goto('/');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(homePage);

    // Clean up the fixture.
    await page.close();
  },
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
  profilePage: async ({ page }, use) => {
    // Set up the fixture.
    const profilePage = new ProfilePage(page);
    await profilePage.visit('brewster');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    await use(profilePage);

    // Clean up the fixture.
    await page.close();
  },
  patronLoginPage: async ({ page }, use) => {
    // Set up the fixture.
    const loginPage = new LoginPage(page);
    await loginPage.loginAs('patron');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(loginPage);

    // Clean up the fixture.
    await page.close();
  },
  privsLoginPage: async ({ page }, use) => {
    // Set up the fixture.
    const loginPage = new LoginPage(page);
    await loginPage.loginAs('privs');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(loginPage);

    // Clean up the fixture.
    await page.close();
  },
  loginPage: async ({ page }, use) => {
    // Set up the fixture.
    const loginPage = new LoginPage(page);

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(loginPage);

    // Clean up the fixture.
    await page.close();
  },
  profilePageUploads: async ({ page }, use) => {
    // Set up the fixture.
    const profilePage = new ProfilePage(page);
    await profilePage.visit('brewster/uploads');

    await page.route(/(analytics|fonts)/, route => {
      route.abort();
    });

    // Use the fixture value in the test.
    await use(profilePage);

    // Clean up the fixture.
    await page.close();
  },
});

test.beforeEach(async ({ request }) => {
  const whathost = await request.get('/services/whathost.php');
  console.log('whathost: ', await whathost.text());
});

export { expect } from '@playwright/test';
