import { expect, test } from '@playwright/test';

test('TV has borrow button', async ({ page }) => {
  await page.goto('https://archive.org/details/CSPAN_20160425_022500_2011_White_House_Correspondents_Dinner')

  const e = page.locator('.action-buttons-section')
  await expect(e).toHaveText(/Borrow Program/)
})
