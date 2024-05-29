import { test } from '../fixtures';

test.fixme(`Profile Page - Uploads: facets appear`, async ({
  profilePageUploads,
}) => {
  await test.step(`Check if date picker appears`, async () => {
    await profilePageUploads.collectionFacets.assertDatePickerVisible();
  });

  await test.step(`Check if facet groups appear`, async () => {
    await profilePageUploads.collectionFacets.assertCollectionFacetGroupCount();
  });
});
