// Run against the local Next server: node --test tests/premium-rsvp.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';

process.loadEnvFile();
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const endpoint = `${base}/api/invitations/20260823-NDTD/rsvps`;

test('Premium RSVP persists edits without duplicates and automatically includes wishes behind password access', async () => {
  const token = randomUUID();
  const responseTokenHash = createHash('sha256').update(token).digest('hex');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const collection = client.db(process.env.MONGODB_DB || 'mo_wedding').collection('rsvps');
  let cookie = '';
  const post = body => fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const summary = async () => {
    const response = await fetch(`${endpoint}/summary`, { headers: { Cookie: cookie } });
    assert.equal(response.status, 200);
    return response.json();
  };
  try {
    for (const suffix of ['summary', 'stream']) {
      assert.equal((await fetch(`${endpoint}/${suffix}`)).status, 401);
      assert.equal((await fetch(`${endpoint}/${suffix}`, { headers: { Cookie: 'kismet-ntdt-guestbook=' + 'a'.repeat(64) } })).status, 401);
    }
    const access = `${base}/api/invitations/20260823-NDTD/guestbook-access`;
    const login = password => fetch(access, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    assert.equal((await login('wrong-password')).status, 401);
    const loginResponse = await login('TDND23082026');
    assert.equal(loginResponse.status, 200);
    assert.match(loginResponse.headers.get('set-cookie'), /HttpOnly/i);
    cookie = loginResponse.headers.get('set-cookie').split(';')[0];
    assert.equal((await post({ guestName: 'Invalid', attending: true, guestCount: 21 })).status, 400);
    assert.equal((await post({ guestName: 'Invalid', attending: true, responseToken: 'bad' })).status, 400);
    assert.equal((await post({ guestName: 'Invalid', attending: true, publishMessage: 'true' })).status, 400);
    const payload = { guestName: `QA ${token}`, attending: true, guestCount: 3,
      message: 'Private QA wish', publishMessage: false, responseToken: token };
    assert.equal((await post(payload)).status, 201);
    const initial = await collection.findOne({ responseTokenHash });
    assert.equal(initial.guestCount, 3);
    assert.equal(initial.responseToken, undefined);
    assert.equal(initial.publishMessage, true);
    const firstEntry = (await summary()).entries.find(entry => entry.guestName === payload.guestName);
    assert.equal(firstEntry.attending, true);
    assert.equal(firstEntry.guestCount, 3);
    assert.equal(firstEntry.message, payload.message);
    assert.equal(firstEntry.responseTokenHash, undefined);
    assert.equal(firstEntry.invitationId, undefined);
    assert.equal((await summary()).wishes.some(wish => wish.guestName === payload.guestName), true);
    // Earlier wishes also appear without requiring an old checkbox to have been selected.
    await collection.updateOne({ responseTokenHash }, { $set: { publishMessage: false } });
    assert.equal((await summary()).wishes.some(wish => wish.guestName === payload.guestName), true);
    await post({ ...payload, publishMessage: undefined });
    assert.equal((await collection.findOne({ responseTokenHash })).publishMessage, true);

    const controller = new AbortController();
    const stream = await fetch(`${endpoint}/stream`, { signal: controller.signal, headers: { Cookie: cookie } });
    assert.match(stream.headers.get('content-type'), /text\/event-stream/);
    const reader = stream.body.getReader();
    let buffer = '';
    const decoder = new TextDecoder();
    const nextSnapshot = async () => {
      while (true) {
        const end = buffer.indexOf('\n\n');
        if (end !== -1) {
          const frame = buffer.slice(0, end); buffer = buffer.slice(end + 2);
          if (frame.startsWith('data: ')) return JSON.parse(frame.slice(6));
        } else {
          const chunk = await reader.read();
          if (chunk.done) throw new Error('Stream ended before update');
          buffer += decoder.decode(chunk.value, { stream: true });
        }
      }
    };
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      await nextSnapshot();
      const edited = { ...payload, attending: false, guestCount: 1, message: '<script>QA</script>', publishMessage: true };
      const response = await post(edited);
      assert.equal(response.status, 200);
      assert.equal((await response.json()).updated, true);
      let live;
      do { live = await nextSnapshot(); } while (!live.wishes.some(wish => wish.guestName === payload.guestName));
      const publicWish = live.wishes.find(wish => wish.guestName === payload.guestName);
      const changedEntry = live.entries.find(entry => entry.guestName === payload.guestName);
      assert.equal(changedEntry.attending, false);
      assert.equal(changedEntry.guestCount, 0);
      assert.equal(changedEntry.message, edited.message);
      assert.equal(publicWish.message, edited.message);
      assert.deepEqual(Object.keys(publicWish).sort(), ['createdAt', 'guestName', 'id', 'message']);
      assert.equal(await collection.countDocuments({ responseTokenHash }), 1);
      assert.equal((await collection.findOne({ responseTokenHash })).guestCount, 0);
      await post({ ...edited, message: '', publishMessage: false });
      assert.equal((await summary()).wishes.some(wish => wish.guestName === payload.guestName), false);
      // A retry on the same response token must keep one response even when requests race.
      const results = await Promise.all([post(payload), post(payload)]);
      assert.ok(results.every(result => result.status === 200));
      assert.equal(await collection.countDocuments({ responseTokenHash }), 1);
    } finally { clearTimeout(timeout); controller.abort(); }
  } finally {
    await collection.deleteMany({ responseTokenHash });
    if (cookie) {
      assert.equal((await fetch(`${base}/api/invitations/20260823-NDTD/guestbook-access`, { method: 'DELETE', headers: { Cookie: cookie } })).status, 200);
      assert.equal((await fetch(`${endpoint}/summary`, { headers: { Cookie: cookie } })).status, 401);
    }
    await client.close();
  }
});
