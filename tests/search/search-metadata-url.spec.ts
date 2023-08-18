import { expect } from '@playwright/test';
import { test } from '../../fixtures';

test('search page check URL changes for sort filter menus click event', async ({ page }) => {
	await page.goto('https://archive.org/search');
	await page.waitForTimeout(3000);
	await expect(page).toHaveURL(/search/);

	const searchInput = page.locator('#text-input');
	await searchInput.fill('cats');
	await searchInput.press('Enter');

	await page.waitForTimeout(3000);
	await expect(page).toHaveURL(/query=cats/);

	await page.getByRole('button', { name: 'Relevance' }).click();
	await page.waitForTimeout(3000);

	await page.getByText('Weekly views').first().click();
	await expect(page).toHaveURL(/query=cats&sort=-week/);

	await page.getByRole('button', { name: 'Toggle options Weekly views' }).getByRole('button').click();
	await page.getByRole('button', { name: 'All-time views' }).click();
	await expect(page).toHaveURL(/query=cats&sort=-downloads/);

	await page.getByRole('button', { name: 'Title' }).click();
	await expect(page).toHaveURL(/query=cats&sort=title/);

	await page.getByText('Date published').first().click();
	await expect(page).toHaveURL(/query=cats&sort=-date/);

	await page.getByRole('button', { name: 'Toggle options Date published' }).getByRole('button').click();
	await page.getByRole('button', { name: 'Date archived' }).click();
	await expect(page).toHaveURL(/query=cats&sort=-publicdate/);

	await page.getByRole('button', { name: 'Toggle options Date archived' }).getByRole('button').click();
	await page.getByRole('button', { name: 'Date reviewed' }).click();
	await expect(page).toHaveURL(/query=cats&sort=-reviewdate/);

	await page.getByRole('button', { name: 'Toggle options Date reviewed Date reviewed' }).getByRole('button').click();
	await page.getByRole('button', { name: 'Date added' }).click();
	await expect(page).toHaveURL(/query=cats&sort=-addeddate/);

	await page.getByRole('button', { name: 'Creator' }).click();
	await expect(page).toHaveURL(/query=cats&sort=creator/);
});
