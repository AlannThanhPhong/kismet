import test from 'node:test';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('Invitation photos open full size throughout the page and preserve navigation', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [390, 900]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/wedding-invitations/20261230-KHAG/index.html`);
      await page.locator('#envelope-trigger').click();
      await page.locator('.typewriter-opening.is-dismissed').waitFor({ state: 'attached' });
      const dialog = page.locator('.tv-lightbox');
      const fullPhoto = dialog.locator('.tv-lightbox-photo');
      // The TV's offscreen film frames are exercised separately below.
      const ordinaryPhotos = page.locator('.invitation img.enlargeable-photo:not(.vintage-tv-track img)');
      assert.ok(await ordinaryPhotos.count() > 20);
      for (const img of await ordinaryPhotos.all()) {
        await img.evaluate(async image => { image.loading = 'eager'; await image.decode(); });
        const expected = await img.evaluate(image => image.currentSrc || image.src);
        await img.scrollIntoViewIfNeeded();
        const bounds = await img.boundingBox();
        // Click the visible photo area, including captions layered over the image.
        await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await dialog.waitFor({ state: 'visible' });
        assert.equal(await fullPhoto.getAttribute('src'), expected);
        assert.equal(await page.locator('body').evaluate(body => body.classList.contains('tv-photo-open')), true);
        await dialog.locator('.tv-lightbox-close').click();
        await dialog.waitFor({ state: 'hidden' });
        await page.waitForFunction(image => document.activeElement === image, await img.elementHandle());
      }
      const first = page.locator('.story-intro-photo img').first();
      await first.focus();
      await page.keyboard.press('Enter');
      await dialog.waitFor({ state: 'visible' });
      const initial = await fullPhoto.getAttribute('src');
      await page.keyboard.press('ArrowRight');
      assert.notEqual(await fullPhoto.getAttribute('src'), initial);
      await page.keyboard.press('ArrowLeft');
      assert.equal(await fullPhoto.getAttribute('src'), initial);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      await page.keyboard.press('Space');
      await dialog.waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      // Text layered over the poster must also open the underlying photograph.
      await page.locator('.chronicles-title').click();
      await dialog.waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      await page.locator('.vintage-tv-track a').first().click();
      await dialog.waitFor({ state: 'visible' });
      assert.ok((await fullPhoto.getAttribute('src')).endsWith('photo_2026-10-12_15-07-07.jpg'));
      await dialog.locator('.tv-lightbox-next').click();
      await dialog.locator('.tv-lightbox-prev').click();
      assert.ok((await fullPhoto.getAttribute('src')).endsWith('photo_2026-10-12_15-07-07.jpg'));
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.body.classList.contains('tv-photo-open'));
      assert.equal(await page.locator('body').evaluate(body => body.classList.contains('tv-photo-open')), false);
      // Closing an enlarged photo must resume the TV film instead of leaving it frozen.
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.locator('.vintage-tv-screen').scrollIntoViewIfNeeded();
      const track = page.locator('.vintage-tv-track');
      const before = await track.evaluate(element => element.style.transform);
      await page.waitForFunction(previous => document.querySelector('.vintage-tv-track').style.transform !== previous, before);
      const screen = await page.locator('.vintage-tv-screen').boundingBox();
      await page.mouse.click(screen.x + screen.width / 2, screen.y + screen.height / 2);
      await dialog.waitFor({ state: 'visible' });
      const paused = await track.evaluate(element => element.style.transform);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.equal(await track.evaluate(element => element.style.transform), paused);
      await page.keyboard.press('Escape');
      await page.waitForFunction(previous => document.querySelector('.vintage-tv-track').style.transform !== previous, paused);
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
});
