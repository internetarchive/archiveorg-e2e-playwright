import { test, expect } from '@playwright/test';

const permanentVariant1 = 'IADefault1';
const permanentVariant2 = 'IADefault2';

test(`Wayback navbar.php with ${permanentVariant1}`, async ({ page }) => {
  await page.goto(`/web/navbar.php?platform=wb&transpiled=1&reCache=1&variant=${permanentVariant1}`);
  await expect(page).toHaveTitle(/Internet Archive Wayback Machine/);

  await expect(page.locator('header#donate_banner')).toBeVisible();
  await expect(page.locator('donation-form-edit-donation')).toBeVisible();

  await expect(page.locator('ia-topnav')).toBeVisible();

  const continueToDonationButton = page.locator('button#continue-button:has-text("Continue")');
  await expect(continueToDonationButton).toBeVisible();
});

test(`Test click to donate page - Wayback navbar.php with ${permanentVariant1}`, async ({ page }) => {
  await page.goto(`/web/navbar.php?platform=wb&transpiled=1&reCache=1&variant=${permanentVariant1}`);

  const continueToDonationButton = page.locator('button#continue-button:has-text("Continue")');
  await expect(continueToDonationButton).toBeVisible();
  await continueToDonationButton.click();

  await expect(page.url()).toContain('https://archive.org/donate');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('donation-form-controller')).toBeVisible();
});

