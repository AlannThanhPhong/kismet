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

const balloonColors = ['#FCE205', '#FCE205', '#FCE205', '#27ad64', '#3f8751', '#95c868'];
openingPlay.addEventListener('click', async () => {
  if (openingStarted) return;
  openingStarted = true;
  void playMusic();
  openingPlay.disabled = true;
  openingPlay.setAttribute('aria-label', 'Đang mở thiệp');
  document.querySelector('.opening-hint').textContent = 'Cùng bay lên với chúng mình…';
  const animations = [];
  const realFrame = document.querySelector('.poster-pair');
  const savedFrameStyle = realFrame.getAttribute('style');
  const secondPanel = realFrame.querySelector('.married');
  const savedSecondStyle = secondPanel.getAttribute('style');
  let placeholder;
  function restoreFrame() {
    if (!placeholder) return;
    placeholder.replaceWith(realFrame);
    realFrame.classList.remove('flight-frame');
    if (savedFrameStyle === null) realFrame.removeAttribute('style');
    else realFrame.setAttribute('style', savedFrameStyle);
    if (savedSecondStyle === null) secondPanel.removeAttribute('style');
    else secondPanel.setAttribute('style', savedSecondStyle);
    placeholder = null;
  }
  function move(element, frames, duration, easing = 'ease-in-out') {
    const animation = element.animate(frames, { duration, easing, fill: 'forwards' });
    animations.push(animation);
    return animation.finished;
  }
  function reveal() {
    openingScreen.hidden = true;
    document.body.classList.remove('invitation-closed');
    window.scrollTo(0, 0);
    invitationContent.classList.add('is-revealing');
  }
  try {
    balloonLayer.innerHTML = `<div class="flight-sky"></div><div class="flight-rig">
      <div class="flight-balloons"><img src="balloon-bouquet-real-fce205.png" alt="" width="320" height="320"></div>
      <svg class="flight-tether" viewBox="0 0 100 80" aria-hidden="true"><g fill="none" stroke="#58a7d4" stroke-width="3" stroke-linecap="round"><path class="tether-upper" d="M50 0Q43 19 50 38"/><path class="tether-lower" d="M50 42Q57 62 50 80"/><path class="tether-joint" d="M50 38v4"/><path class="tether-snap" d="m35 33-7-4m7 16-7 4m37-16 7-4m-7 16 7 4"/></g></svg>
      <div class="flight-card"></div></div>`;
    const sky = balloonLayer.querySelector('.flight-sky');
    const rig = balloonLayer.querySelector('.flight-rig');
    const balloons = balloonLayer.querySelector('.flight-balloons');
    const card = balloonLayer.querySelector('.flight-card');
    const mobile = innerWidth <= 600;
    const originalRect = realFrame.getBoundingClientRect();
    const panelHeight = mobile ? realFrame.querySelector('.hero').getBoundingClientRect().height : originalRect.height;
    const layout = getComputedStyle(realFrame);
    placeholder = document.createElement('div');
    placeholder.className = 'flight-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    Object.assign(placeholder.style, { width: `${originalRect.width}px`, height: `${originalRect.height}px`, margin: layout.margin, visibility: 'hidden' });
    realFrame.before(placeholder);
    // Carry the actual DOM panel at its original layout size, scaled as one piece.
    // On phones the first full-size portrait is the landing frame.
    if (mobile) secondPanel.style.display = 'none';
    realFrame.classList.add('flight-frame');
    const balloonRatio = mobile ? .82 : .66;
    const tetherHeight = mobile ? 30 : 38;
    const imageRatio = 1.02;
    const rideWidth = Math.min(innerWidth * (mobile ? .74 : .82), mobile ? 330 : 680,
      (innerHeight * .90 - tetherHeight) / (panelHeight / originalRect.width + balloonRatio * imageRatio));
    const carryScale = rideWidth / originalRect.width;
    rig.style.width = `${rideWidth}px`;
    balloons.style.width = `${rideWidth * balloonRatio}px`;
    Object.assign(card.style, { width: `${rideWidth}px`, height: `${panelHeight * carryScale}px` });
    Object.assign(realFrame.style, { width: `${originalRect.width}px`, maxWidth: 'none', margin: '0', transform: `scale(${carryScale})` });
    card.append(realFrame);
    let decodeTimer;
    await Promise.race([
      Promise.all([...rig.querySelectorAll('img')].map(image => image.decode().catch(() => {}))),
      new Promise(resolve => { decodeTimer = setTimeout(resolve, 2000); }),
    ]);
    clearTimeout(decodeTimer);
    openingScreen.classList.add('is-departing');
    balloonLayer.hidden = false;
    balloonLayer.classList.add('is-rising');
    balloonLayer.dataset.stage = 'rising';
    if (reducedMotion) {
      reveal();
      await move(balloonLayer, [{ opacity: 1 }, { opacity: 0 }], 250);
    } else {
      await move(rig, [
        { transform: 'translate(-50%, 100svh) rotate(-3deg)' },
        { transform: 'translate(-50%, -45%) rotate(1deg)', offset: .75 },
        { transform: 'translate(-50%, -50%) rotate(0deg)' },
      ], 4200, 'cubic-bezier(.2,.55,.3,1)');
      openingScreen.hidden = true;
      balloonLayer.dataset.stage = 'snapping';
      balloonLayer.querySelector('.tether-joint').style.opacity = '0';
      await Promise.all([
        move(balloonLayer.querySelector('.tether-upper'), [{ transform: 'translateY(0)' }, { transform: 'translateY(-15px)', opacity: 0 }], 450),
        move(balloonLayer.querySelector('.tether-lower'), [{ transform: 'translateY(0)' }, { transform: 'translateY(12px)', opacity: 0 }], 450),
        move(balloonLayer.querySelector('.tether-snap'), [{ opacity: 0 }, { opacity: 1, offset: .25 }, { opacity: 0 }], 450),
        move(balloons, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-90svh) rotate(-8deg)', opacity: 0 }], 900, 'ease-in'),
      ]);
      balloonLayer.dataset.stage = 'zooming';
      const from = card.getBoundingClientRect();
      balloonLayer.append(card);
      card.classList.add('is-zooming');
      Object.assign(card.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
      rig.hidden = true;
      reveal();
      const target = placeholder.getBoundingClientRect();
      const landingScale = originalRect.width / from.width;
      await Promise.all([
        move(card, [
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${target.left - from.left}px,${target.top - from.top}px) scale(${landingScale})` },
        ], 2300, 'cubic-bezier(.3,0,.15,1)'),
        move(sky, [{ opacity: 1 }, { opacity: 1, offset: .35 }, { opacity: 0 }], 2300),
      ]);
      restoreFrame();
    }
  } catch (error) {
    console.warn('Opening animation interrupted', error);
  } finally {
    restoreFrame();
    reveal();
    balloonLayer.hidden = true;
    animations.forEach(animation => animation.cancel());
    balloonLayer.replaceChildren();
    document.body.classList.remove('invitation-opening');
    invitationContent.inert = false;
    const title = document.querySelector('#couple-title');
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    celebrate();
  }
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
