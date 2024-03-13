import { test } from '../fixtures';

test('Canonical URL has no initial parameters', async ({ bookPage }) => {
  await bookPage.assertUrlInitialParameters();
});

test(`BookReader navigations - On load, pages fit fully inside of the BookReader™`, async ({ bookPage }) => {
  await bookPage.assertPageBoundingBox();
});

test(`BookReader navigations - Nav menu displays properly`, async ({ bookPage }) => {
  await bookPage.assertNavigationElements();
});

test(`BookReader navigations - 2up mode - Clicking "Previous page" changes the page`, async ({ bookPage }) => {
  await bookPage.assertBookPageChange();
});

test(`BookReader navigations - Clicking "page flip buttons" updates location`, async ({ bookPage }) => {
  await bookPage.assertPageFlipUpdateUrlLocation();
});