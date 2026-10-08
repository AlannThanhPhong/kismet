(() => {
  'use strict';
  const code = '20260110-NHVVAM';
  const audio = document.getElementById('wedding-audio');
  const music = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');
  audio.volume = 0.45;
  function updateMusic() {
    const playing = !audio.paused;
    music.setAttribute('aria-pressed', String(playing));
    music.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    musicLabel.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
  }
  async function playMusic() {
    audio.muted = false;
    try {
      await audio.play();
      updateMusic();
    } catch {
      updateMusic();
      musicLabel.textContent = 'Thử lại nhạc';
    }
  }
  music.addEventListener('click', () => { if (audio.paused) void playMusic(); else audio.pause(); });
  audio.addEventListener('play', updateMusic);
  audio.addEventListener('pause', updateMusic);
  audio.addEventListener('error', () => { musicLabel.textContent = 'Thử lại nhạc'; music.setAttribute('aria-pressed', 'false'); });
  const opening = document.getElementById('opening-screen');
  const content = document.getElementById('invitation-content');
  const play = document.getElementById('intro-play');
  const film = document.getElementById('film-intro');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  play.focus({ preventScroll: true });
  play.addEventListener('click', async () => {
    if (play.disabled) return;
    play.disabled = true;
    void playMusic();
    const status = opening.querySelector('.intro-status');
    status.textContent = 'Đang mở thước phim…';
    // Decode the newly supplied photos before moving the reel, even on slow connections.
    await Promise.all([...film.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
    play.hidden = true;
    film.hidden = false;
    opening.classList.add('is-playing');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const track = film.querySelector('.film-track');
    const frames = [...track.children];
    const filmWindow = film.querySelector('.film-window');
    const distance = frames.at(-1).offsetTop - frames[0].offsetTop;
    try {
      if (!reducedMotion.matches) {
        await track.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(-' + distance + 'px)' }
        ], { duration: 3900, easing: 'cubic-bezier(.2,.65,.3,1)', fill: 'forwards' }).finished;
      }
      track.style.transform = 'translateY(-' + distance + 'px)';
      if (!reducedMotion.matches) await new Promise(resolve => setTimeout(resolve, 250));
      opening.classList.add('is-zooming');
      const rect = filmWindow.getBoundingClientRect();
      const scale = Math.min(innerWidth / rect.width, innerHeight / rect.height) * 0.95;
      status.textContent = 'Thiệp cưới Huyền Vy và Anh Minh';
      await Promise.all([
        filmWindow.animate([{ transform: 'scale(1)' }, { transform: 'scale(' + (reducedMotion.matches ? 1 : scale) + ')' }], { duration: reducedMotion.matches ? 500 : 850, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).finished,
        opening.animate([{ opacity: 1 }, { opacity: 1, offset: .55 }, { opacity: 0 }], { duration: reducedMotion.matches ? 500 : 850, fill: 'forwards' }).finished
      ]);
    } finally {
      opening.hidden = true;
      content.inert = false;
      document.body.classList.remove('intro-locked');
      document.getElementById('view-invitation').focus({ preventScroll: true });
    }
  });

  document.getElementById('view-invitation').addEventListener('click', (event) => {
    event.preventDefault();
    // Start playback within the tap gesture before moving to the invitation.
    void playMusic();
    history.replaceState(null, '', '#loi-moi');
    document.getElementById('loi-moi').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });

  document.getElementById('save-date').addEventListener('click', () => {
    const calendar = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mo//Wedding Invitation//VI', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:20260110-NHVVAM@mo-wedding', 'DTSTAMP:20260101T000000Z', 'DTSTART:20260110T100000Z', 'DTEND:20260110T140000Z',
      'SUMMARY:Tiệc cưới Huyền Vy & Anh Minh',
      'LOCATION:Victory – Sảnh Valentine\\, 12 Mai Hắc Đế\\, Buôn Ma Thuột\\, Đắk Lắk',
      'DESCRIPTION:Đón khách 17:00. Làm lễ 17:30. Khai tiệc 17:45. Giờ Việt Nam.',
      'END:VEVENT', 'END:VCALENDAR', '',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = `${code}.ics`; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  const dialog = document.getElementById('photo-dialog');
  const photos = Array.from(document.querySelectorAll('.gallery-item'));
  const largePhoto = document.getElementById('large-photo');
  let photoIndex = 0;
  let returnFocus = null;
  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const source = photos[photoIndex].querySelector('img');
    largePhoto.classList.toggle('gallery-crop-right', source.classList.contains('gallery-crop-right'));
    largePhoto.src = source.src; largePhoto.alt = source.alt;
    document.getElementById('photo-caption').textContent = photos[photoIndex].querySelector('span').textContent;
    document.getElementById('photo-count').textContent = `${photoIndex + 1} / ${photos.length}`;
  }
  photos.forEach((button, index) => button.addEventListener('click', () => {
    returnFocus = button; showPhoto(index); dialog.showModal(); document.body.classList.add('dialog-open');
  }));
  document.getElementById('close-photo').addEventListener('click', () => dialog.close());
  document.getElementById('prev-photo').addEventListener('click', () => showPhoto(photoIndex - 1));
  document.getElementById('next-photo').addEventListener('click', () => showPhoto(photoIndex + 1));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); } if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); returnFocus?.focus({ preventScroll: true }); });

  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('rsvp-status');
  const submit = document.getElementById('submit-rsvp');
  const countField = document.getElementById('guest-count-field');
  form.addEventListener('change', () => { countField.hidden = new FormData(form).get('attending') === 'false'; });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const guestName = String(data.get('guestName') || '').trim();
    if (!guestName) { document.getElementById('guest-name').focus(); status.textContent = 'Bạn điền tên trước khi gửi nhé.'; status.dataset.error = 'true'; return; }
    submit.disabled = true; status.dataset.error = 'false'; status.textContent = 'Đang gửi lời hồi âm…';
    try {
      const response = await fetch(`/api/invitations/${code}/rsvps`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ guestName, attending: data.get('attending') === 'true', guestCount: Number(data.get('guestCount')), message: String(data.get('message') || '').trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Chưa gửi được lời hồi âm. Bạn thử lại nhé.');
      status.textContent = 'Đã gửi lời hồi âm. Cảm ơn bạn đã dành tình cảm cho chúng mình!';
      form.reset(); countField.hidden = false;
    } catch (error) {
      status.dataset.error = 'true';
      status.textContent = error.name === 'TimeoutError' ? 'Kết nối mất nhiều thời gian. Bạn thử gửi lại nhé.' : error.message || 'Chưa gửi được lời hồi âm. Bạn thử lại nhé.';
    } finally { submit.disabled = false; }
  });
})();
