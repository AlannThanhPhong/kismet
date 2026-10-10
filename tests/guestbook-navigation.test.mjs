import test from 'node:test';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('Guestbook keeps invitation audio alive and returns to the opened invitation until reload', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const path of ['/thiep/20260823-NDTD', '/wedding-invitations/20260823-NDTD/index.html']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/guestbook-access', route => route.fulfill({ json: { unlocked: true } }));
      await page.route('**/rsvps/summary', route => route.fulfill({ json: { responses: 0, guests: 0, wishCount: 0, wishes: [] } }));
      await page.goto(`${base}${path}`);
      const invitation = page.frames().find(frame => frame.url().includes('/wedding-invitations/'));
      await invitation.locator('.opening-play').click();
      await invitation.waitForFunction(() => !document.querySelector('.invitation-content').inert);
      await invitation.waitForFunction(() => !document.querySelector('#wedding-music').paused);
      await invitation.evaluate(() => { window.testMusic = document.querySelector('#wedding-music'); });
      const openGuestbook = async () => {
        await invitation.locator('#open-guestbook').click();
        await invitation.locator('#unlock-password').fill('mock-password');
        await invitation.locator('#guestbook-unlock-form [type=submit]').click();
        await page.waitForURL('**#loi-chuc');
        const guestbook = invitation.frameLocator('.guestbook-page');
        await guestbook.locator('.guestbook-back').waitFor();
        return guestbook;
      };
      const guestbook = await openGuestbook();
      const before = await invitation.evaluate(() => window.testMusic.currentTime);
      await invitation.waitForFunction(time => window.testMusic.currentTime > time + 0.25, before);
      assert.equal(await invitation.evaluate(() => window.testMusic === document.querySelector('#wedding-music') && !window.testMusic.paused), true);
      await guestbook.locator('.guestbook-back').click();
      await invitation.locator('.guestbook-page').waitFor({ state: 'detached' });
      assert.equal(await invitation.locator('.opening-screen').isHidden(), true);
      assert.equal(await invitation.evaluate(() => !document.querySelector('.invitation-content').inert && !window.testMusic.paused), true);
      await openGuestbook();
      await page.goBack();
      await invitation.locator('.guestbook-page').waitFor({ state: 'detached' });
      await page.goForward();
      await invitation.locator('.guestbook-page').waitFor();
      await page.goBack();
      await invitation.locator('.guestbook-page').waitFor({ state: 'detached' });
      assert.equal(await invitation.locator('.opening-screen').isHidden(), true);
      await openGuestbook();
      await page.reload();
      const refreshed = page.frames().find(frame => frame.url().includes('/wedding-invitations/'));
      await refreshed.locator('.opening-play').waitFor();
      assert.equal(await refreshed.locator('.opening-screen').isVisible(), true);
      assert.equal(await refreshed.locator('.guestbook-page').count(), 0);
      assert.equal(await refreshed.evaluate(() => document.querySelector('#wedding-music').paused), true);
      assert.equal(new URL(page.url()).hash, '');
      await refreshed.locator('.opening-play').click();
      await refreshed.waitForFunction(() => !document.querySelector('.invitation-content').inert);
      await refreshed.locator('#open-guestbook').click();
      await refreshed.locator('#unlock-password').fill('mock-password');
      await refreshed.locator('#guestbook-unlock-form [type=submit]').click();
      const reopenedBack = refreshed.frameLocator('.guestbook-page').locator('.guestbook-back');
      await reopenedBack.waitFor();
      await reopenedBack.evaluate(element => new Promise(resolve => {
        const ready = () => Object.keys(element).some(key => key.startsWith('__reactProps$')) ? resolve() : setTimeout(ready, 20);
        ready();
      }));
      await reopenedBack.click();
      await refreshed.locator('.guestbook-page').waitFor({ state: 'detached' });
      assert.equal(await refreshed.locator('.opening-screen').isHidden(), true);
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
});
