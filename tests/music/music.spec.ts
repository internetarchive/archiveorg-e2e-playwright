import { test } from '../fixtures';

test('Play a Grateful Dead Soundtrack', async ({ musicPage }) => {
  await musicPage.gotoMusicPage('gd73-06-10.sbd.hollister.174.sbeok.shnf');
  await musicPage.validatePageElements();
  await musicPage.playAndPauseMusic();
  await musicPage.page.close();
});
