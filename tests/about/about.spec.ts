import { test, expect } from '@playwright/test';

import { identifier, testBeforeEachConfig } from '../../config';

test.beforeEach(async ({ context }) => {
  await testBeforeEachConfig(context);
});

test('Canonical About page has correct title and text', async ({ page }) => {
  await page.goto(identifier.about.url);
  await expect(page).toHaveTitle(/About IA/);
  await expect(page.locator('h1:has-text("About the Internet Archive")')).toBeVisible();
  await expect(page.locator('#maincontent').locator('a:has-text("Job Opportunities")')).toBeVisible();
  await expect(page.locator('#maincontent').locator('a:has-text("Terms of Service")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('501(c)(3) non-profit');
  await expect(page.locator('news-stories')).toBeVisible();
});

test('About > Bios page has correct title and text', async ({ page }) => {
  await page.goto(identifier.about.bios);
  await expect(page).toHaveTitle(/Bios/);
  await expect(page.locator('h1:has-text("Bios")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('A passionate advocate for public Internet access');
});

test('About > Contact page has correct title and text', async ({ page }) => {
  await page.goto(identifier.about.contact);
  await expect(page).toHaveTitle(/Contact/);
  await expect(page.locator('h1:has-text("Contacts at the Internet Archive")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('300 Funston Avenue');
  await expect(page.locator('#maincontent').locator('a:has-text("Frequently Asked Questions")')).toBeVisible();
});

test('About > Credits page has correct title and text', async ({ page }) => {
  await page.goto(identifier.about.credits);
  await expect(page).toHaveTitle(/Credits/);
  await expect(page.locator('h1:has-text("Credits: Thank You from the Internet Archive")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('The Kahle/Austin Foundation');
});

test('About > Jobs page has correct title and text', async ({ page }) => {
  await page.goto(identifier.about.jobs);
  await expect(page).toHaveTitle(/Jobs/);
  await expect(page.locator('h1:has-text("Job Opportunities")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('Based in San Francisco');
});

test('About > News Stories page has correct title and text', async ({page}) => {
  await page.goto(identifier.about.news);
  await page.waitForURL(/news-stories/);
  await expect(page).toHaveTitle(/News Stories/);
  await expect(page.locator('h1:has-text("News stories")')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText(
    'Including The Wayback Machine',
  );
});

test('About > Terms of Service page has correct title and text', async ({page}) => {
  await page.goto(identifier.about.terms);
  await expect(page).toHaveTitle(/Terms of Use/);
  await expect(page.locator('h1:has-text("Terms of Use")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText(
    'This terms of use agreement',
  );
});

test('About > Volunteer Positions page has correct title and text', async ({page}) => {
  await page.goto(identifier.about.volunteer);
  await expect(page).toHaveTitle(/Volunteer Positions/);
  await expect(page.locator('h1:has-text("Volunteer Positions")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText(
    'We could always use a hand',
  );
});
