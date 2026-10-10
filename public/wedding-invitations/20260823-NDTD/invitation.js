const music = document.querySelector('#wedding-music');
const musicToggle = document.querySelector('.music-toggle');
const openingScreen = document.querySelector('.opening-screen');
const openingPlay = document.querySelector('.opening-play');
const invitationContent = document.querySelector('.invitation-content');
const balloonLayer = document.querySelector('.balloon-layer');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let openingStarted = false;
invitationContent.inert = true;
let musicStarting = false;
music.volume = 0.45;

function updateMusicButton() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', `${playing ? 'Tắt' : 'Phát'} nhạc nền ONLY — LeeHi`);
  musicToggle.querySelector('.music-label').textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
  openingPlay.classList.toggle('is-playing', playing);
}

async function playMusic() {
  if (musicStarting) return;
  musicStarting = true;
  try {
    await music.play();
  } catch {
    document.querySelector('.opening-hint').textContent = 'Bạn có thể bấm Bật nhạc trong thiệp để thử lại.';
    updateMusicButton();
  } finally {
    musicStarting = false;
  }
}

music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
music.addEventListener('error', updateMusicButton);
music.addEventListener('timeupdate', () => {
  const progress = Number.isFinite(music.duration) && music.duration > 0 ? music.currentTime / music.duration * 100 : 0;
  document.querySelector('.opening-progress span').style.width = `${progress}%`;
});
document.querySelector('.opening-back').addEventListener('click', () => {
  music.currentTime = Math.max(0, music.currentTime - 10);
});
document.querySelector('.opening-forward').addEventListener('click', () => {
  if (Number.isFinite(music.duration)) music.currentTime = Math.min(music.duration, music.currentTime + 10);
});
musicToggle.addEventListener('click', () => {
  if (musicStarting) return;
  if (music.paused) playMusic();
  else music.pause();
});

const balloonColors = ['#f7ce46', '#eebc30', '#ffe58a', '#27ad64', '#3f8751', '#95c868'];
const balloonFragment = document.createDocumentFragment();
for (let row = 0; row < 16; row += 1) {
  for (let column = 0; column < 12; column += 1) {
    const balloon = document.createElement('span');
    balloon.className = 'opening-balloon';
    balloon.style.cssText = `--x:${column * 9.5 - 6 + Math.random() * 2}vw;--y:0;--color:${balloonColors[Math.floor(Math.random() * balloonColors.length)]};--delay:${row * 0.1 + Math.random() * 0.025}s;--tilt:${Math.random() * 24 - 12}deg;--drift:${Math.random() * 6 - 3}vw;`;
    balloonFragment.appendChild(balloon);
  }
}
balloonLayer.appendChild(balloonFragment);

openingPlay.addEventListener('click', () => {
  if (openingStarted) return;
  openingStarted = true;
  // Call play synchronously within the click so audio starts with this gesture.
  playMusic();
  openingPlay.disabled = true;
  openingPlay.setAttribute('aria-label', 'Đang phát ONLY — LeeHi và mở thiệp');
  openingScreen.classList.add('is-playing');
  balloonLayer.classList.add('is-rising');

  window.setTimeout(() => {
    openingScreen.hidden = true;
    document.body.classList.remove('invitation-closed');
    document.body.classList.add('invitation-opening');
    window.scrollTo(0, 0);
  }, reducedMotion ? 200 : 1000);

  window.setTimeout(() => {
    invitationContent.classList.add('is-revealing');
  }, reducedMotion ? 250 : 1900);

  window.setTimeout(() => {
    balloonLayer.replaceChildren();
    balloonLayer.hidden = true;
    document.body.classList.remove('invitation-opening');
    invitationContent.inert = false;
    const title = document.querySelector('#couple-title');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    celebrate();
  }, reducedMotion ? 500 : 3150);
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const photoButtons = [...document.querySelectorAll('.gallery-item, .portrait-photo')];
const photos = photoButtons.map(button => button.querySelector('img'));
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  lightboxImage.src = photos[currentPhoto].src;
  lightboxImage.alt = photos[currentPhoto].alt;
  lightbox.querySelector('p').textContent = `${currentPhoto + 1} / ${photos.length} · THANH ĐIỀN & NGỌC DUNG`;
}
photoButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showPhoto(index);
    lightbox.showModal();
    document.body.classList.add('viewing-photo');
  });
});
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showPhoto(currentPhoto + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => document.body.classList.remove('viewing-photo'));

const premium = window.weddingPremium || {};
document.querySelector('.film-grain').hidden = premium.effects?.filmGrain === false;
function celebrate() {
  if (reducedMotion || premium.effects?.fireworks === false || document.hidden) return;
  const layer = document.querySelector('.fireworks-layer');
  layer.replaceChildren();
  for (let burst = 0; burst < 3; burst += 1) {
    for (let spark = 0; spark < 28; spark += 1) {
      const angle = spark / 28 * Math.PI * 2;
      const radius = 60 + Math.random() * Math.min(140, innerWidth / 3);
      const dot = document.createElement('span');
      dot.className = 'firework-spark';
      dot.style.cssText = `--spark-x:${25 + burst * 25}%;--spark-y:${25 + burst * 8}%;--spark-dx:${Math.cos(angle) * radius}px;--spark-dy:${Math.sin(angle) * radius + 40}px;--spark-color:${balloonColors[spark % balloonColors.length]};--spark-delay:${burst * .3}s`;
      layer.append(dot);
    }
  }
  window.setTimeout(() => layer.replaceChildren(), 2200);
}

function safeMediaUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, location.href);
    return url.protocol === 'https:' || url.origin === location.origin ? url.href : null;
  } catch { return null; }
}
if (premium.brideAddress) {
  document.querySelector('.bride-address').textContent = premium.brideAddress;
  document.querySelector('.bride-location-note').textContent = 'Địa chỉ nhà gái';
  const map = document.querySelector('.bride-map');
  map.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(premium.brideAddress)}`;
  map.textContent = 'Chỉ đường nhà gái ↗';
}
const videoUrl = safeMediaUrl(premium.videoUrl);
if (videoUrl) {
  document.querySelector('.wedding-video').hidden = false;
  document.querySelector('.wedding-video video').src = videoUrl;
}
for (const gift of premium.gifts || []) {
  const qrUrl = safeMediaUrl(gift.qrImage);
  if (!gift.bankName || !gift.accountNumber || !gift.accountName || !qrUrl) continue;
  const card = document.createElement('article');
  card.className = 'premium-card';
  const title = document.createElement('h3');
  title.textContent = gift.label;
  const qr = document.createElement('img');
  qr.src = qrUrl; qr.alt = `VietQR ${gift.label}`; qr.loading = 'lazy'; qr.width = 240; qr.height = 240;
  card.append(title, qr);
  for (const [index, value] of [gift.bankName, gift.accountNumber, gift.accountName].entries()) {
    const line = document.createElement('p');
    line.textContent = value;
    if (index === 1) line.className = 'account-number';
    card.append(line);
  }
  const copy = document.createElement('button');
  copy.type = 'button'; copy.className = 'button secondary'; copy.textContent = 'Sao chép số tài khoản';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(gift.accountNumber);
      document.querySelector('.gift-status').textContent = 'Đã sao chép số tài khoản.';
    } catch { document.querySelector('.gift-status').textContent = 'Bạn có thể chọn và sao chép số tài khoản bên trên.'; }
  });
  card.append(copy);
  document.querySelector('.gift-grid').append(card);
  document.querySelector('.wedding-gifts').hidden = false;
}

const rsvpForm = document.querySelector('#rsvp-form');
const rsvpStatus = document.querySelector('#rsvp-status');
const countInput = document.querySelector('#guest-count');
const responseKey = 'kismet:20260823-NDTD:rsvp';
let savedResponse = {};
try { savedResponse = JSON.parse(localStorage.getItem(responseKey) || '{}') || {}; } catch { /* Storage may be disabled. */ }
let responseToken = typeof savedResponse.responseToken === 'string' && /^[a-f0-9-]{36}$/i.test(savedResponse.responseToken)
  ? savedResponse.responseToken : crypto.randomUUID();
if (savedResponse.guestName) {
  rsvpForm.elements.guestName.value = savedResponse.guestName;
  rsvpForm.elements.attending.value = savedResponse.attending ? 'yes' : 'no';
  countInput.value = savedResponse.guestCount || 1;
  rsvpForm.elements.message.value = savedResponse.message || '';
}
function updateGuestCount() {
  countInput.disabled = rsvpForm.elements.attending.value !== 'yes';
}
rsvpForm.addEventListener('change', updateGuestCount);
updateGuestCount();
rsvpForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submit = rsvpForm.querySelector('[type=submit]');
  if (submit.disabled) return;
  const attending = rsvpForm.elements.attending.value === 'yes';
  const payload = { guestName: rsvpForm.elements.guestName.value.trim(), attending,
    guestCount: attending ? Number(countInput.value) : 1, message: rsvpForm.elements.message.value.trim(),
    publishMessage: true, responseToken };
  if (!payload.guestName) { rsvpStatus.textContent = 'Bạn hãy điền tên trước khi gửi nhé.'; return; }
  // Keep the same token after a lost network response, so a retry cannot create a duplicate.
  try { localStorage.setItem(responseKey, JSON.stringify(payload)); } catch { /* Submission still works. */ }
  submit.disabled = true;
  rsvpStatus.textContent = 'Đang gửi xác nhận…';
  try {
    const response = await fetch('/api/invitations/20260823-NDTD/rsvps', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Chưa gửi được. Bạn thử lại nhé.');
    rsvpStatus.textContent = result.updated ? 'Đã cập nhật xác nhận và lời chúc của bạn. Cảm ơn bạn ♡' : 'Đã lưu xác nhận và lời chúc. Cảm ơn bạn ♡';
    celebrate();
  } catch (error) {
    rsvpStatus.textContent = error.name === 'TimeoutError' ? 'Kết nối chậm. Bạn hãy gửi lại; xác nhận sẽ không bị lặp.' : error.message;
  } finally { submit.disabled = false; }
});
