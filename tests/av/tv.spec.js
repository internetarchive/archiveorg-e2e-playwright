import { expect, test } from '@playwright/test';

import { identifier } from '../../config';

test.beforeEach(async ({ request, context }) => {
  if(process.env.IS_REVIEW_APP === 'true') {
    await context.addCookies([{
      name: 'beta-access',
      value: process.env.BETA_ACCESS_TOKEN || '',
      path: '/',
      domain: '.archive.org'
    }]);
  }
});

test('TV has borrow button', async ({ page }) => {
  await page.goto(`${identifier.av.default}`)

  const e = page.locator('.action-buttons-section')
  await expect(e).toHaveText(/Borrow Program/)
})
