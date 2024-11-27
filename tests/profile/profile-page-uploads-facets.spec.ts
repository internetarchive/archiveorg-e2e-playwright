import { test } from '../fixtures';
import { SearchFacetGroupHeaderNames } from '../models';

test(`Profile Page - Uploads: facets appear`, async ({
  profilePageUploads,
}) => {
  await test.step(`Check if date picker appears`, async () => {
    await profilePageUploads.collectionFacets.assertDatePickerVisible();
  });

  await test.step(`Check if facet groups appear`, async () => {
    await profilePageUploads.collectionFacets.assertFacetGroupCount(
      'search', SearchFacetGroupHeaderNames,
    );
  });
});
