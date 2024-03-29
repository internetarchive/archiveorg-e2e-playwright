import { test, expect } from '@playwright/test';

test('Canonical About page has correct title and text', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveTitle(/About IA/);
  await expect(page.locator('h1:has-text("About the Internet Archive")')).toBeVisible();
  await expect(page.locator('a:has-text("Terms of Service")')).toBeVisible();
  await expect(page.locator('a:has-text("Job Opportunities")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('501(c)(3) non-profit');
});

test('About > Jobs page has correct title and text', async ({ page }) => {
  await page.goto('/about/jobs.php');
  await expect(page).toHaveTitle(/Jobs/);
  await expect(page.locator('h1:has-text("Job Opportunities")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('Based in San Francisco');
});

test('About > Terms of Service page has correct title and text', async ({ page }) => {
  await page.goto('/about/terms.php');
  await expect(page).toHaveTitle(/Terms of Use/);
  await expect(page.locator('h1:has-text("Terms of Use")')).toBeVisible();
  await expect(page.locator('#maincontent')).toContainText('This terms of use agreement');
});

test('About > News Stories page has correct title and text', async ({ page }) => {
  await page.goto('/about/news-stories');
  await expect(page).toHaveTitle(/News Stories/);
  await expect(page.locator('h1:has-text("News stories")')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('Including The Wayback Machine');
});
