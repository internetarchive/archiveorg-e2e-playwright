import { test, expect, Page } from '@playwright/test';

let page: Page;
const PAGE_FLIP_WAIT_TIME = 1000;

/**
 * Check URL page parameter in # and path
 */
const isPageInUrl = async () => {
  const hash = await page.evaluate(() => window.location.hash);
  const href = await page.evaluate(() => window.location.href);
  if (hash) {
    return hash.indexOf('#page/') > -1;
  } else {
    return href.indexOf('/page/') > -1;
  }
};

/**
 * Check URL mode parameter in # and path
 *
 * @param mode '1up', '2up', 'thumb'
 */
const isModeInUrl = async (mode: string) => {
  const hash = await page.evaluate(() => window.location.hash);
  const href = await page.evaluate(() => window.location.href);
  if (hash) {
    return hash.indexOf('/mode/' + mode) > -1;
  } else {
    return href.indexOf('/mode/' + mode) > -1;
  }
};

test.beforeAll(async ({ browser }) => {
  // https://playwright.dev/docs/test-retries#reuse-single-page-between-tests
  page = await browser.newPage();

  // Go to the starting url before each test.
  await page.goto('https://archive.org/details/theworksofplato01platiala');
});

test.afterAll(async () => {
  await page.close();
});

test('On load, pages fit fully inside of the BookReader™', async () => {
  await page.waitForTimeout(5000);

  const iaBookTheater = page.locator('ia-book-theater');
  const bookReaderShell = iaBookTheater.locator('#BookReader');
  const brContainer = bookReaderShell.locator('.BRcontainer');

  const brShellBox = await bookReaderShell.boundingBox();
  const brContainerBox = await brContainer.boundingBox();

  // images do not get cropped vertically
  expect(brContainerBox?.height).toBeLessThanOrEqual(
    Number(brShellBox?.height),
  );
  // images do not get cropped horizontally
  expect(brContainerBox?.width).toBeLessThanOrEqual(Number(brShellBox?.width));
});

test('Canonical URL has no initial parameters', async () => {
  // Go to the starting url before each test.
  // await page.goto('https://archive.org/details/theworksofplato01platiala');
  // const pageUrl = new URL(page.url())
  const pageHash = await page.evaluate(() => window.location.hash);
  const pageUrl = await page.evaluate(() => window.location.href);

  // Initial URL has no params
  expect(pageHash).toEqual('');
  // Initial URL has no page/ mode/
  expect(pageUrl).not.toEqual('#page/');
  expect(pageUrl).not.toContain('/page/');
  expect(pageUrl).not.toContain('/mode/');
});

test.describe('Test bookreader navigations', () => {
  test.describe.configure({ mode: 'serial' });

  test('1. On load, pages fit fully inside of the BookReader™', async () => {
    await page.waitForTimeout(5000);

    const iaBookTheater = page.locator('ia-book-theater');
    const bookReaderShell = iaBookTheater.locator('#BookReader');
    const brContainer = bookReaderShell.locator('.BRcontainer');

    const brShellBox = await bookReaderShell.boundingBox();
    const brContainerBox = await brContainer.boundingBox();

    // images do not get cropped vertically
    expect(brContainerBox?.height).toBeLessThanOrEqual(
      Number(brShellBox?.height),
    );
    // images do not get cropped horizontally
    expect(brContainerBox?.width).toBeLessThanOrEqual(
      Number(brShellBox?.width),
    );
  });

  test('2. nav menu displays properly', async () => {
    await page.waitForTimeout(5000);

    const iaBookTheater = page.locator('ia-book-theater');
    const bookReaderShell = iaBookTheater.locator('#BookReader');
    const brFooter = bookReaderShell.locator('.BRfooter');

    // flipping
    const goLeft = brFooter.locator('.BRicon.book_left');
    const goRight = brFooter.locator('.BRicon.book_right');
    const goNext = brFooter.locator('.BRicon.book_flip_next');
    const goPrev = brFooter.locator('.BRicon.book_flip_prev');

    const mode1Up = brFooter.locator('.BRicon.onepg');
    const mode2Up = brFooter.locator('.BRicon.twopg');
    const modeThumb = brFooter.locator('.BRicon.thumb');
    const viewMode = brFooter.locator('.BRicon.viewmode');

    // zoom
    const zoomIn = brFooter.locator('.BRicon.zoom_in');
    const zoomOut = brFooter.locator('.BRicon.zoom_out');

    expect(await goLeft.count()).toEqual(1);
    expect(await goRight.count()).toEqual(1);
    expect(await goNext.count()).toEqual(1);
    expect(await goPrev.count()).toEqual(1);

    expect(await mode1Up.count()).toEqual(1);
    expect(await mode2Up.count()).toEqual(1);
    expect(await modeThumb.count()).toEqual(1);
    expect(await viewMode.count()).toEqual(1);

    expect(await zoomIn.count()).toEqual(1);
    expect(await zoomOut.count()).toEqual(1);
  });

  test('3. 2up mode - Clicking `Previous page` changes the page', async () => {
    await page.waitForTimeout(5000);

    const iaBookTheater = page.locator('ia-book-theater');
    const bookReaderShell = iaBookTheater.locator('#BookReader');
    const brContainer = bookReaderShell.locator('.BRcontainer');
    const brFooter = bookReaderShell.locator('.BRfooter');

    const goNext = brFooter.locator('.BRicon.book_flip_next');
    const goPrev = brFooter.locator('.BRicon.book_flip_prev');

    // Go to next page, so we can go previous if at front cover
    await goNext.click();
    await page.waitForTimeout(PAGE_FLIP_WAIT_TIME);
    await goNext.click();
    await page.waitForTimeout(PAGE_FLIP_WAIT_TIME);

    const onLoadBrState = brContainer.nth(0); // .child(0);
    const initialImages = onLoadBrState.locator('img'); // .find('img');
    const origImg1Src = await initialImages.nth(0).getAttribute('src');
    const origImg2Src = await initialImages.nth(-1).getAttribute('src');

    await goPrev.click();
    await page.waitForTimeout(PAGE_FLIP_WAIT_TIME);

    const nextBrState = brContainer.nth(0);
    const prevImages = nextBrState.locator('img');
    const prevImg1Src = await prevImages.nth(0).getAttribute('src');
    const prevImg2Src = await prevImages.nth(-1).getAttribute('src');

    // we aren't showing the same image in both leaves
    expect(origImg1Src).not.toEqual(origImg2Src);

    // we are showing new pages
    expect(prevImg1Src).not.toEqual(origImg1Src);
    expect(prevImg1Src).not.toEqual(origImg2Src);
    expect(prevImg2Src).not.toEqual(origImg1Src);
    expect(prevImg2Src).not.toEqual(origImg2Src);

    // we aren't showing the same image in the new pages
    expect(prevImg1Src).not.toEqual(prevImg2Src);
  });

  test('4. Clicking `page flip buttons` updates location', async () => {
    await page.waitForTimeout(2000);

    const iaBookTheater = page.locator('ia-book-theater');
    const bookReaderShell = iaBookTheater.locator('#BookReader');
    const brFooter = bookReaderShell.locator('.BRfooter');
    const goNext = brFooter.locator('.BRicon.book_flip_next');
    const goPrev = brFooter.locator('.BRicon.book_flip_prev');

    // Page navigation creates params
    await goNext.click();
    expect(await isPageInUrl()).toEqual(true);
    expect(await isModeInUrl('2up')).toEqual(true);

    await goPrev.click();
    expect(await isPageInUrl()).toEqual(true);
    expect(await isModeInUrl('2up')).toEqual(true);
  });
});
