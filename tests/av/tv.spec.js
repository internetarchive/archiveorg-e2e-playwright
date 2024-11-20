import { expect, test } from '@playwright/test';

import { identifier } from '../../config';

test('TV has borrow button', async ({ page }) => {
  await page.goto(`${identifier.av.default}`)

  const e = page.locator('.action-buttons-section')
  await expect(e).toHaveText(/Borrow Program/)
})
