import { chromium, devices } from '@playwright/test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { photos } from '../src/config.js';

await mkdir('artifacts', { recursive: true });
const photoHashes = await Promise.all(photos.map(async ({ id }) => createHash('sha256').update(await readFile(`public/images/${id}-800.webp`)).digest('hex')));
assert.equal(new Set(photoHashes).size, photos.length, 'Album contains duplicate images');
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: 'pipe', windowsHide: true });
const base = 'http://127.0.0.1:4175';
let browser;
try {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    if (i === 59) throw new Error('Preview server did not start');
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  browser = await chromium.launch();
  const errors = [];
  for (const [name, settings] of [
    ['desktop', { viewport: { width: 1440, height: 1000 } }],
    ['laptop', { viewport: { width: 1366, height: 650 } }],
    ['mobile', { ...devices['iPhone 13'] }],
    ['small-mobile', { viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true }],
    ['reduced-motion', { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }],
  ]) {
    const context = await browser.newContext(settings);
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`${name}: ${error.message}`));
    page.on('response', (response) => { if (response.status() >= 400) errors.push(`${name}: HTTP ${response.status()} ${response.url()}`); });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('#invitation').evaluate((el) => el.inert), true);
    assert.equal(await page.locator('#wedding-audio').evaluate((el) => el.paused), true);
    assert.ok(await page.locator('.cover-names').evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const box = range.getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth;
    }), `${name}: cover names clipped`);
    await page.screenshot({ path: `artifacts/${name}-cover.png` });
    await page.getByRole('button', { name: 'MỞ THIỆP' }).click();
    await page.waitForFunction(() => document.body.classList.contains('is-open'));
    await page.waitForFunction(() => { const a = document.querySelector('audio'); return !a.paused && a.currentTime > 0; }, { timeout: 15000 });
    assert.equal(await page.locator('#invitation').evaluate((el) => el.inert), false);
    await page.getByRole('button', { name: 'Tắt nhạc' }).click();
    assert.equal(await page.locator('audio').evaluate((el) => el.paused), true);
    await page.getByRole('button', { name: 'Bật nhạc' }).click();
    await page.waitForFunction(() => !document.querySelector('audio').paused);
    await page.waitForTimeout(1500);
    if (settings.viewport.width >= 900) {
      assert.ok(await page.evaluate(() => {
        const hero = document.querySelector('.hero').getBoundingClientRect();
        const header = document.querySelector('.site-header').getBoundingClientRect();
        return hero.bottom <= innerHeight + 1 && ['.hero-title', '.hero-date', '.hero-copy .text-link', '.hero-image > img'].every(selector => {
          const box = document.querySelector(selector).getBoundingClientRect();
          return box.top >= header.bottom - 1 && box.bottom <= innerHeight;
        }) && getComputedStyle(document.querySelector('.hero-image > img')).objectFit === 'contain';
      }), `${name}: opening portrait and text must fit in the viewport without cropping`);
    }
    await page.screenshot({ path: `artifacts/${name}-hero.png` });
    const text = await page.locator('main').innerText();
    for (const expected of ['Trần Quang Hồ', 'Trần Thị Phượng', 'Lê Văn Lộc', 'Hà Thị Kim Cương', 'Trần Thị Kim Hiên', 'Lê Văn Tài', '09:00', '11:00', '18 tháng 9']) assert.ok(text.includes(expected), `Missing ${expected}`);
    assert.equal(await page.locator('#map-link').isVisible(), true);
    const directions = new URL(await page.locator('#map-link').getAttribute('href'));
    assert.equal(directions.searchParams.get('destination'), '11.6115556,106.0021111');
    assert.equal(await page.locator('#map-pending').isVisible(), false);
    assert.equal(await page.locator('#venue-map').isVisible(), true);
    assert.ok((await page.locator('#map-embed').getAttribute('src')).startsWith('https://www.google.com/maps/embed?pb='));
    await page.locator('#venue-map').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    assert.ok(await page.locator('#map-embed').evaluate((el) => el.getBoundingClientRect().width <= innerWidth));
    await page.screenshot({ path: `artifacts/${name}-map.png` });
    assert.equal(await page.locator('[data-photo]').count(), photos.length);
    await page.locator('#save-date').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#save-date').click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'Kim-Hien-Van-Tai-27-10-2026.ics');
    const stream = await download.createReadStream();
    let calendar = '';
    for await (const chunk of stream) calendar += chunk.toString();
    assert.ok(calendar.includes('DTSTART:20261027T040000Z'));
    await page.locator('[data-photo="0"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.locator('[data-photo="0"]').click();
    assert.equal(await page.locator('#lightbox').evaluate((el) => el.open), true);
    await page.getByRole('button', { name: 'Ảnh tiếp theo' }).click();
    assert.equal(await page.locator('.lightbox-count').innerText(), `02 / ${photos.length}`);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('.lightbox-count').innerText(), `01 / ${photos.length}`);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('.lightbox-count').innerText(), `${photos.length} / ${photos.length}`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lightbox').evaluate((el) => el.open), false);
    await page.locator('[data-photo]').last().scrollIntoViewIfNeeded();
    await page.locator('[data-photo] img').last().evaluate((img) => img.decode());
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `artifacts/${name}-gallery-end.png` });
    for (const item of await page.locator('.reveal:not([hidden])').all()) await item.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(300);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name}: horizontal overflow`);
    assert.equal(await page.locator('main img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)), true);
    await page.screenshot({ path: `artifacts/${name}-full.png`, fullPage: true });
    if (name === 'reduced-motion') assert.equal(await page.locator('.petal').count(), 0);
    console.log(`PASS ${name}: cover, audio, details, calendar, gallery, images, no overflow.`);
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log('All browser checks passed.');
} finally {
  await browser?.close();
  server.kill();
}
