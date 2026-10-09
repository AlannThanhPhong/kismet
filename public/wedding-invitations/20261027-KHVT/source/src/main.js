import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource/great-vibes/vietnamese-400.css';
import './style.css';
import './hero.css';
import './curtain.css';
import './celebration.css';
import { curtainFabric, openCurtains } from './curtain.js';
import { wedding, photos } from './config.js';

const icons = {
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  music: '<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  volume: '<path d="m11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  muted: '<path d="m11 5-6 4H2v6h3l6 4V5Zm5 4 6 6m0-6-6 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 5h3"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const flourish = `<svg class="flourish" viewBox="0 0 240 38" fill="none" aria-hidden="true"><path d="M5 19h65c25 0 26-15 39-15 11 0 15 12 11 15-4-3 0-15 11-15 13 0 14 15 39 15h65M70 19c25 0 26 15 39 15 11 0 15-12 11-15 4 3 0 15 11 15 13 0 14-15 39-15" stroke="currentColor"/><circle cx="120" cy="19" r="3" fill="currentColor"/></svg>`;
const botanical = `<svg class="botanical" viewBox="0 0 240 440" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1"><path d="M30 435C190 320 38 208 178 24M70 393c-37-50-39-91-19-115 33 45 32 79 19 115Zm29-84c47-24 73-54 69-94-45 22-69 54-69 94Zm-5-69c-46-32-61-65-49-96 41 24 57 57 49 96Zm25-77c46-8 77-33 81-67-44 9-73 31-81 67Zm28-67c-31-30-35-59-21-83 28 24 35 52 21 83Z"/><path d="M68 397 52 290m45 22 65-88m-66 19-48-91m68 16 77-66m-47-4-18-79"/></g></svg>`;
const photo = (id, cls = '', eager = false) => `<img class="${cls}" src="/wedding-invitations/20261027-KHVT/images/${id}-800.webp" srcset="/wedding-invitations/20261027-KHVT/images/${id}-800.webp 800w, /wedding-invitations/20261027-KHVT/images/${id}-1200.webp 1200w" sizes="(max-width: 600px) 100vw, 50vw" width="800" height="${id === '0V7A7908' ? 533 : 1200}" alt="Ảnh cưới Kim Hiên và Văn Tài" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />`;

document.querySelector('#app').innerHTML = `
  <div class="cover" id="cover" role="dialog" aria-modal="true" aria-label="Thiệp mời cưới Kim Hiên và Văn Tài">
    <div class="cover-panel cover-left" aria-hidden="true">${curtainFabric('left')}</div><div class="cover-panel cover-right" aria-hidden="true">${curtainFabric('right')}</div>
    <div class="cover-grain"></div><div class="cover-arch" aria-hidden="true"><span>✦</span></div>${botanical}<div class="botanical-mirror">${botanical}</div>
    <div class="cover-content">
      <p class="eyebrow cover-eyebrow">MỘT NGÀY ĐẶC BIỆT · MỘT ĐỜI BÊN NHAU</p>
      <div class="envelope" aria-hidden="true"><div class="envelope-letter"><span>Trân trọng kính mời</span><span class="letter-monogram">H <i>&</i> T</span></div><svg class="envelope-shell" viewBox="0 0 300 180" fill="none"><defs><linearGradient id="envelope-paper" x1="0" y1="0" x2="290" y2="180" gradientUnits="userSpaceOnUse"><stop stop-color="#b54859"/><stop offset=".5" stop-color="#90283d"/><stop offset="1" stop-color="#69152b"/></linearGradient><linearGradient id="envelope-pocket" x1="150" y1="65" x2="150" y2="180" gradientUnits="userSpaceOnUse"><stop stop-color="#a93a4e"/><stop offset="1" stop-color="#841d33"/></linearGradient></defs><path d="M1 7Q1 1 8 4L143 82Q150 87 157 82L292 4Q299 1 299 7V165Q299 179 285 179H15Q1 179 1 165Z" fill="url(#envelope-paper)" stroke="#e2bba1" stroke-opacity=".35"/><path d="m6 173 132-88q12-8 24 0l132 88q-3 5-12 5H18q-9 0-12-5Z" fill="url(#envelope-pocket)"/><path d="m5 8 137 79q8 5 16 0L295 8M7 172l127-83m159 83L166 89" stroke="#f0cfa8" stroke-opacity=".3" stroke-width=".8"/></svg><div class="wax-seal">囍</div></div>
      <p class="cover-invite">Thiệp mời Lễ Vu Quy</p>
      <h1 class="cover-names">Kim Hiên <span>&</span> Văn Tài</h1>
      <p class="cover-date">27 <span>—</span> 10 <span>—</span> 2026</p>
      <button class="button cover-open" id="open-invitation">MỞ THIỆP ${icon('arrow')}</button>
      <p class="sound-hint">${icon('music')} Chạm mở thiệp, nghe giai điệu yêu thương</p>
    </div>
    <span class="cover-footer">GỬI BẠN MỘT CHÚT YÊU THƯƠNG</span>
  </div>

  <div id="invitation" inert>
    <header class="site-header"><a href="#home" class="monogram" aria-label="Về đầu thiệp">H<span>&</span>T</a><nav aria-label="Điều hướng thiệp"><a href="#invitation-details">Lời mời</a><a href="#celebration">Ngày chung đôi</a><a href="#album">Album cưới</a></nav><div class="header-actions"><span class="header-date">27.10.2026</span><button class="music-toggle" id="music-toggle" aria-label="Bật nhạc" aria-pressed="false" title="Bật nhạc">${icon('muted')}</button></div></header>
    <main>
      <section class="hero" id="home">
        <div class="hero-copy">
          <p class="eyebrow hero-enter">THIỆP MỜI LỄ VU QUY</p>
          <div class="hero-title hero-enter"><span class="small-script">Chúng mình cưới!</span><h2><span class="hero-name">Kim Hiên</span><span class="hero-amp">&</span><span class="hero-name">Văn Tài</span></h2></div>
          <div class="hero-enter">${flourish}<p class="hero-message">Hạnh phúc là khi hành trình phía trước<br />có một người để cùng bước chung</p></div>
          <div class="hero-date hero-enter"><span>THỨ BA</span><strong>27.10.2026</strong><span>TƯ GIA NHÀ GÁI</span></div>
          <a href="#invitation-details" class="text-link hero-enter">CÙNG MỞ RA NGÀY HẠNH PHÚC ${icon('down')}</a>
          ${botanical}
        </div>
        <div class="hero-image"><img src="/wedding-invitations/20261027-KHVT/images/0V7A7519-1200.webp" srcset="/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp 800w, /wedding-invitations/20261027-KHVT/images/0V7A7519-1200.webp 1200w" sizes="(max-width: 760px) 100vw, 50vw" width="1200" height="1800" fetchpriority="high" alt="Ảnh chính cô dâu Kim Hiên và chú rể Văn Tài" /><span class="photo-note">You & me, forever</span><div class="image-frame"></div></div>
        <div class="hero-bottom">SAVE THE DATE <span>✦</span> 27 OCTOBER 2026 <span>✦</span> TOGETHER FOREVER</div>
      </section>

      <section class="invitation-section section-space" id="invitation-details">
        <div class="section-intro reveal"><p class="eyebrow">TỪ HAI GIA ĐÌNH, MỘT NIỀM HẠNH PHÚC</p><h2 class="script-heading">Trân trọng báo tin</h2>${flourish}</div>
        <div class="families reveal"><div><p class="eyebrow">NHÀ GÁI</p><p class="parent"><span><span class="parent-label">Ông</span> <strong>Trần Quang Hồ</strong></span><span><span class="parent-label">Bà</span> <strong>Trần Thị Phượng</strong></span></p><p class="address">Tổ 10, ấp Tân Đông 1,<br />xã Tân Lập</p></div><span class="family-symbol" aria-hidden="true">囍</span><div><p class="eyebrow">NHÀ TRAI</p><p class="parent"><span><span class="parent-label">Ông</span> <strong>Lê Văn Lộc</strong></span><span><span class="parent-label">Bà</span> <strong>Hà Thị Kim Cương</strong></span></p><p class="address">Trường An, Trường Tây,<br />Long Hoa, Tây Ninh</p></div></div>
        <div class="couple-announcement reveal"><p class="eyebrow">LỄ VU QUY CỦA HAI CON CHÚNG TÔI</p><div class="full-names"><div><h3>Trần Thị Kim Hiên</h3><span>ÚT NỮ</span></div><span class="name-and">&</span><div><h3>Lê Văn Tài</h3><span>ÚT NAM</span></div></div><p class="invitation-prose">Thật hạnh phúc khi ngày vui của chúng tôi<br class="desktop-break" /> có sự hiện diện và lời chúc phúc của bạn</p></div>
      </section>

      <section class="celebration section-space" id="celebration">${botanical}<div class="section-intro reveal"><p class="eyebrow">HẸN BẠN VÀO NGÀY HẠNH PHÚC</p><h2 class="script-heading">Ngày mình chung đôi</h2><p>Thứ Ba, ngày 27 tháng 10 năm 2026</p><p class="lunar">Nhằm ngày 18 tháng 9 năm Âm lịch</p></div>
        <div class="celebration-program">
          <article class="reception-feature reveal" aria-labelledby="reception-title">
            <p class="eyebrow reception-invite">TRÂN TRỌNG KÍNH MỜI</p>
            <h3 id="reception-title">Tiệc chung vui</h3>
            <p class="reception-welcome">Đón tiếp và nhập tiệc lúc</p>
            <p class="reception-time"><time datetime="2026-10-27T11:00:00+07:00">11:00</time></p>
            <p class="reception-venue">TẠI TƯ GIA</p>
          </article>
          <div class="program-divider reveal" aria-hidden="true"><span></span>${icon('heart')}<span></span></div>
          <article class="ceremony-note reveal" aria-label="Nghi thức thành hôn">
            <h3>Lễ Vu Quy <span aria-hidden="true">·</span> <time datetime="2026-10-27T09:00:00+07:00">09:00</time></h3>
            <p>Hôn lễ được cử hành tại Tư Gia</p>
          </article>
        </div>
        <div class="event-actions reveal"><button class="button button-red" id="save-date">${icon('calendar')} LƯU NGÀY VUI</button></div>
        <div class="countdown-wrap reveal"><p class="eyebrow" id="countdown-label">ĐẾM NGƯỢC ĐẾN NGÀY CHUNG ĐÔI</p><div class="countdown" id="countdown" aria-label="Thời gian còn lại đến hôn lễ"><div><strong id="days">00</strong><span>NGÀY</span></div><i>:</i><div><strong id="hours">00</strong><span>GIỜ</span></div><i>:</i><div><strong id="minutes">00</strong><span>PHÚT</span></div><i>:</i><div><strong id="seconds">00</strong><span>GIÂY</span></div></div></div>
      </section>

      <section class="album-section section-space" id="album"><div class="album-heading reveal"><div><p class="eyebrow">NHỮNG KHOẢNH KHẮC CỦA CHÚNG MÌNH</p><h2 class="script-heading">Một tình yêu, một đời</h2></div><p>Giữ lại những dịu dàng,<br />để mai này cùng nhớ</p></div><div class="gallery">${photos.map((p, i) => `<button class="gallery-item reveal ${p.wide ? 'gallery-wide' : ''}" data-photo="${i}" aria-label="Xem ảnh ${i + 1}: ${p.caption}">${photo(p.id)}<span class="gallery-caption"><span>${p.caption}</span>${icon('expand')}</span></button>`).join('')}</div></section>

      <section class="location-section section-space" id="location" aria-labelledby="location-title">
        <div class="section-intro reveal"><p class="eyebrow">ĐỊA ĐIỂM TỔ CHỨC</p><h2 class="script-heading" id="location-title">Đường đến ngày vui</h2></div>
        <p class="map-pending reveal" id="map-pending">${icon('pin')} Bản đồ chỉ đường sẽ được cập nhật sớm</p>
        <div class="venue-map reveal" id="venue-map" hidden><div class="venue-map-heading">${icon('pin')}<div><h3>Hẹn bạn tại tư gia</h3><p>${wedding.address}</p></div></div><iframe id="map-embed" title="Bản đồ địa điểm tổ chức Lễ Vu Quy Kim Hiên và Văn Tài" width="600" height="450" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <div class="location-actions reveal"><a class="button button-red" id="map-link" hidden target="_blank" rel="noopener noreferrer">${icon('pin')} CHỈ ĐƯỜNG</a></div>
      </section>

      <section class="thank-you"><div class="thank-photo">${photo('0V7A7908')}</div><div class="thank-overlay"></div><div class="thank-content reveal"><p class="eyebrow">SỰ HIỆN DIỆN CỦA BẠN LÀ NIỀM VINH HẠNH CỦA GIA ĐÌNH</p><h2>Hẹn gặp bạn<br /><span>trong ngày vui!</span></h2>${flourish}<p>Cảm ơn bạn đã là một phần<br />trong ngày đặc biệt của chúng mình</p><span class="thank-signature">Kim Hiên & Văn Tài</span></div></section>
      <footer><a class="monogram" href="#home">H<span>&</span>T</a><p>MỘT ĐỜI BÊN NHAU · 27.10.2026</p><a href="#home" class="back-top" aria-label="Về đầu trang">${icon('down')}</a></footer>
    </main>
    <div class="scroll-progress" aria-hidden="true"></div>
  </div>
  <div class="petals" aria-hidden="true"></div>
  <dialog class="lightbox" id="lightbox" aria-label="Album ảnh cưới"><button class="lightbox-close" aria-label="Đóng ảnh">${icon('close')}</button><button class="lightbox-prev" aria-label="Ảnh trước">${icon('arrow')}</button><figure><img id="lightbox-image" alt="" /><figcaption id="lightbox-caption" aria-live="polite"></figcaption></figure><button class="lightbox-next" aria-label="Ảnh tiếp theo">${icon('arrow')}</button><span class="lightbox-count"></span></dialog>
  <audio id="wedding-audio" src="${wedding.music}" preload="auto" loop playsinline></audio>
  <div class="toast" role="status" aria-live="polite"></div>
`;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const audio = document.querySelector('#wedding-audio');
const musicButton = document.querySelector('#music-toggle');
const cover = document.querySelector('#cover');
const invitation = document.querySelector('#invitation');
let opened = false;
let toastTimer;
function toast(message) {
  const el = document.querySelector('.toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 5000);
}
function syncAudio() {
  const playing = !audio.paused;
  musicButton.classList.toggle('playing', playing);
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', playing ? 'Tắt nhạc' : 'Bật nhạc');
  musicButton.title = playing ? 'Tắt nhạc' : 'Bật nhạc';
  musicButton.innerHTML = icon(playing ? 'volume' : 'muted');
}
function playMusic() {
  // Call play synchronously inside the click gesture so mobile browsers allow audio.
  const promise = audio.play();
  if (promise) promise.catch(() => toast('Chạm vào biểu tượng loa trên thanh đầu trang để phát nhạc nhé'));
}
audio.volume = 0.65;
audio.addEventListener('play', syncAudio);
audio.addEventListener('pause', syncAudio);
audio.addEventListener('error', () => { if (opened) toast('Nhạc chưa tải được Bạn thử bật lại nhạc sau một chút nhé'); });
musicButton.addEventListener('click', () => audio.paused ? playMusic() : audio.pause());

document.querySelector('#open-invitation').addEventListener('click', async () => {
  if (opened) return;
  opened = true;
  playMusic();
  window.scrollTo({ top: 0, behavior: 'instant' });
  cover.classList.add('opening');
  document.body.classList.add('is-opening');
  await openCurtains(cover, reducedMotion);
  document.body.classList.remove('is-sealed');
  document.body.classList.remove('is-opening');
  document.body.classList.add('is-open');
  invitation.inert = false;
  cover.hidden = true;
  const home = document.querySelector('#home');
  home.tabIndex = -1;
  home.focus({ preventScroll: true });
  observeReveals();
  createPetals();
});

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${(i % 2) * 100}ms`);
    observer.observe(el);
  });
}
function createPetals() {
  if (reducedMotion.matches) return;
  const container = document.querySelector('.petals');
  container.innerHTML = Array.from({ length: window.innerWidth < 760 ? 10 : 18 }, (_, i) => `<span class="petal" style="--x:${(i * 7.31) % 100}%;--delay:${-i * 1.7}s;--duration:${14 + i % 7}s;--drift:${(i % 2 ? 1 : -1) * (40 + i * 5)}px;--size:${7 + i % 6}px"></span>`).join('');
}
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('tab-hidden', document.hidden);
});
reducedMotion.addEventListener('change', () => {
  document.querySelector('.petals').innerHTML = '';
  if (opened) createPetals();
});

let scrollPending = false;
function updateScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.scroll-progress').style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  document.querySelector('.site-header').classList.toggle('scrolled', y > 30);
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
}, { passive: true });

function updateCountdown() {
  const diff = Math.max(0, new Date(wedding.date).getTime() - Date.now());
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
  ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => { document.getElementById(id).textContent = String(values[i]).padStart(2, '0'); });
  if (!diff) document.querySelector('#countdown-label').textContent = 'MỘT ĐỜI BÊN NHAU BẮT ĐẦU TỪ ĐÂY';
}
updateCountdown();
setInterval(updateCountdown, 1000);

if (wedding.mapsUrl && /^https:\/\//i.test(wedding.mapsUrl)) {
  const link = document.querySelector('#map-link');
  link.href = wedding.mapsUrl;
  link.hidden = false;
  document.querySelector('#map-pending').hidden = true;
}
if (wedding.mapsEmbedUrl) {
  const embedUrl = new URL(wedding.mapsEmbedUrl);
  if (embedUrl.origin === 'https://www.google.com' && embedUrl.pathname === '/maps/embed') {
    document.querySelector('#map-embed').src = embedUrl.href;
    document.querySelector('#venue-map').hidden = false;
    document.querySelector('#map-pending').hidden = true;
  }
}
document.querySelector('#save-date').addEventListener('click', () => {
  const escape = (value) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HienTai//Wedding//VI', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:hien-tai-20261027@wedding.local', `DTSTAMP:${stamp}`, 'DTSTART:20261027T040000Z', 'DTEND:20261027T060000Z', `SUMMARY:${escape('Tiệc cưới Kim Hiên & Văn Tài')}`, `LOCATION:${escape(wedding.address)}`, `DESCRIPTION:${escape('Lễ Vu Quy lúc 9 giờ Nhập tiệc lúc 11 giờ tại tư gia nhà gái Ngày 27/10/2026 (18/9 Âm lịch)')}`, 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Ngày mai dự tiệc cưới Kim Hiên & Văn Tài', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'Kim-Hien-Van-Tai-27-10-2026.ics'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  toast('Đã tạo lịch ngày vui Mở tệp vừa tải để thêm vào lịch của bạn');
});

const lightbox = document.querySelector('#lightbox');
let currentPhoto = 0;
let galleryTrigger;
function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const p = photos[currentPhoto];
  const img = document.querySelector('#lightbox-image');
  img.src = `/wedding-invitations/20261027-KHVT/images/${p.id}-1200.webp`;
  img.alt = p.caption + ' — Kim Hiên & Văn Tài';
  document.querySelector('#lightbox-caption').textContent = p.caption;
  document.querySelector('.lightbox-count').textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${photos.length}`;
}
document.querySelectorAll('[data-photo]').forEach((button) => button.addEventListener('click', () => {
  galleryTrigger = button;
  showPhoto(Number(button.dataset.photo));
  lightbox.showModal();
  document.body.classList.add('lightbox-open');
}));
document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
document.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
lightbox.addEventListener('close', () => { document.body.classList.remove('lightbox-open'); galleryTrigger?.focus({ preventScroll: true }); });
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); showPhoto(currentPhoto + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); showPhoto(currentPhoto - 1); }
});
let touchStart;
lightbox.addEventListener('touchstart', (e) => { touchStart = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  if (touchStart === null || touchStart === undefined) return;
  const delta = e.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 60) showPhoto(currentPhoto + (delta < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
