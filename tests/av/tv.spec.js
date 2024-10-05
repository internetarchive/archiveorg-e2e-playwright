import { expect, test } from '@playwright/test';

import { pageIdentifiers } from '../identifiers';
const { details } = pageIdentifiers;

test('TV has borrow button', async ({ page }) => {
  await page.goto(details.item.whitehouse);

  const e = page.locator('.action-buttons-section');
  await expect(e).toHaveText(/Borrow Program/);
})
