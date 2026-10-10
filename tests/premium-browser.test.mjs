// Supply PLAYWRIGHT_MODULE if Playwright is installed outside this repository.
import test from 'node:test';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('Premium invitation works at mobile/desktop sizes and safely renders wishes', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const snapshot = { responses: 1, guests: 2, wishCount: 1,
        wishes: [{ id: 'qa', guestName: '<img src=x onerror=alert(1)>', message: '<script>window.qaInjected=true</script>', createdAt: '2026-10-10T00:00:00Z' }] };
      await page.route('**/rsvps/stream', route => route.fulfill({ contentType: 'text/event-stream', body: `data: ${JSON.stringify(snapshot)}\n\n` }));
      await page.route('**/rsvps/summary', route => route.fulfill({ json: snapshot }));
      const payloads = [];
      await page.route('**/20260823-NDTD/rsvps', async route => {
        payloads.push(route.request().postDataJSON());
        await route.fulfill({ status: payloads.length === 1 ? 201 : 200, json: { saved: true, updated: payloads.length > 1 } });
      });
      await page.goto(`${base}/wedding-invitations/20260823-NDTD/index.html`);
      await page.locator('.opening-play').click();
      await page.waitForFunction(() => document.querySelector('.opening-screen').hidden && !document.querySelector('.invitation-content').inert);
      await page.locator('#guest-name').fill('Bạn thân');
      await page.locator('#guest-count').fill('3');
      await page.locator('#guest-message').fill('Chúc hai bạn hạnh phúc ♡');
      assert.equal(await page.locator('[name=publishMessage]').count(), 0);
      await page.locator('#rsvp-form [type=submit]').click();
      await page.waitForFunction(() => document.querySelector('#rsvp-status').textContent.includes('Đã lưu'));
      await page.locator('[name=attending][value=no]').check();
      assert.equal(await page.locator('#guest-count').isDisabled(), true);
      await page.locator('#rsvp-form [type=submit]').click();
      await page.waitForFunction(() => document.querySelector('#rsvp-status').textContent.includes('Đã cập nhật'));
      assert.equal(payloads.length, 2);
      assert.equal(payloads[0].responseToken, payloads[1].responseToken);
      assert.equal(payloads[1].attending, false);
      assert.equal(payloads[0].guestCount, 3);
      assert.equal(payloads[0].publishMessage, true);
      assert.equal(await page.locator('#guestbook-wishes, .rsvp-totals').count(), 0);
      assert.equal(await page.evaluate(() => window.qaInjected), undefined);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.locator('.firework-spark').count(), 0);
      assert.equal(await page.locator('.wedding-gifts').isVisible(), false);
      assert.equal(await page.locator('.wedding-video').isVisible(), false);
      assert.deepEqual(errors, []);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${base}/thiep/20260823-NDTD`);
    const frame = page.frameLocator('iframe');
    await frame.locator('.opening-play').click();
    const invitationFrame = page.frames().find(item => item.url().includes('/wedding-invitations/20260823-NDTD/'));
    await invitationFrame.waitForFunction(() => !document.querySelector('.invitation-content').inert);
    assert.ok(await frame.locator('.firework-spark').count() > 0);
    await invitationFrame.waitForFunction(() => document.querySelector('.fireworks-layer').childElementCount === 0);
    await frame.locator('#xac-nhan').scrollIntoViewIfNeeded();
    await frame.locator('#guest-name').waitFor({ state: 'visible' });
    assert.equal(await frame.locator('.location-grid article').count(), 2);
    assert.equal(await frame.locator('.gallery-item, .portrait-photo').count(), 22);
    await page.screenshot({ path: 'public/wedding-invitations/20260823-NDTD/previews/premium-rsvp-390.png' });
    await page.close();
  } finally { await browser.close(); }
});

test('Guestbook button requires a password, opens a separate page, and locks again', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`${base}/thiep/20260823-NDTD/loi-chuc`);
    assert.equal(await page.locator('.guestbook-login').isVisible(), true);
    assert.equal(await page.locator('.guestbook-totals').count(), 0);
    await page.goto(`${base}/thiep/20260823-NDTD`);
    const frame = page.frameLocator('iframe');
    await frame.locator('.opening-play').click();
    const inner = page.frames().find(item => item.url().includes('/wedding-invitations/'));
    await inner.waitForFunction(() => !document.querySelector('.invitation-content').inert);
    await frame.locator('#open-guestbook').click();
    assert.equal(await frame.locator('.guestbook-unlock').isVisible(), true);
    await frame.locator('#unlock-password').fill('wrong-password');
    await frame.locator('#guestbook-unlock-form [type=submit]').click();
    await inner.waitForFunction(() => document.querySelector('#unlock-status').textContent.includes('chưa đúng'));
    await frame.locator('#unlock-password').fill('TDND23082026');
    await frame.locator('#guestbook-unlock-form [type=submit]').click();
    await page.waitForURL('**/thiep/20260823-NDTD/loi-chuc');
    await page.locator('.guestbook-totals').waitFor();
    assert.equal(await page.locator('.guestbook-login').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.evaluate(() => document.cookie.includes('kismet-ntdt-guestbook')), false);
    await page.screenshot({ path: 'public/wedding-invitations/20260823-NDTD/previews/private-guestbook-390.png' });
    const snapshot = { responses: 2, guests: 3, wishCount: 1, attending: 1, declined: 1,
      entries: [{ id: 'qa', guestName: 'Bạn thân', attending: true, guestCount: 3, message: '<script>window.qaInjected=true</script>', createdAt: '2026-10-10T00:00:00Z', updatedAt: '2026-10-10T00:00:00Z' },
        { id: 'qa-no', guestName: 'Bạn ở xa', attending: false, guestCount: 0, message: '', createdAt: '2026-10-10T00:00:00Z', updatedAt: '2026-10-10T00:00:00Z' }],
      wishes: [{ id: 'qa', guestName: '<img src=x onerror=alert(1)>', message: '<script>window.qaInjected=true</script>', createdAt: '2026-10-10T00:00:00Z' }] };
    await page.route('**/rsvps/summary', route => route.fulfill({ json: snapshot }));
    await page.route('**/rsvps/stream', route => route.fulfill({ contentType: 'text/event-stream', body: `data: ${JSON.stringify(snapshot)}\n\n` }));
    await page.getByRole('button', { name: 'Cập nhật danh sách' }).click();
    await page.locator('.guestbook-table tbody tr').first().waitFor();
    assert.equal(await page.locator('.guestbook-table tbody tr').count(), 2);
    await page.getByRole('searchbox').fill('Bạn thân');
    assert.equal(await page.locator('.guestbook-table tbody tr').count(), 1);
    await page.locator('.guestbook-table summary').click();
    assert.match(await page.locator('.response-detail').innerText(), /Đi cùng: 2 người/);
    assert.equal(await page.locator('.response-detail script').count(), 0);
    await page.getByRole('searchbox').fill('');
    await page.locator('.guestbook-filters select').selectOption('no');
    assert.equal(await page.locator('.guestbook-table tbody tr').count(), 1);
    assert.match(await page.locator('.guestbook-table tbody').innerText(), /Bạn ở xa/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.getByRole('button', { name: 'Lời chúc (' }).click();
    await page.locator('.guestbook-grid article').waitFor();
    assert.equal(await page.locator('.guestbook-grid script, .guestbook-grid img').count(), 0);
    assert.equal(await page.evaluate(() => window.qaInjected), undefined);
    await page.getByRole('button', { name: 'Khóa sổ lưu bút' }).click();
    await page.locator('.guestbook-login').waitFor();
    assert.equal(await page.locator('.guestbook-totals, .guestbook-grid').count(), 0);
    await page.reload();
    assert.equal(await page.locator('.guestbook-login').isVisible(), true);
    assert.deepEqual(errors, []);
  } finally { await page.close(); await browser.close(); }
});
