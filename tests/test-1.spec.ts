import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://archive.org/details/gd73-06-10.sbd.hollister.174.sbeok.shnf');
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByLabel('Video Player').click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: 'Pause' }).click();
});