document.querySelectorAll('.gallery-grid img').forEach((image) => {
  image.addEventListener('error', () => image.closest('figure')?.remove(), { once: true });
});

const opening = document.querySelector('.curtain-opening');
const weddingSong = document.querySelector('#wedding-song');
const musicToggles = document.querySelectorAll('.music-toggle, .music-fab');

function updateMusicButton() {
  if (!(weddingSong instanceof HTMLAudioElement)) return;
  const playing = !weddingSong.paused;
  document.body.classList.toggle('music-playing', playing);
  musicToggles.forEach((button) => {
    button.setAttribute('aria-label', playing ? 'Pause wedding music' : 'Play wedding music');
    button.setAttribute('aria-pressed', String(playing));
    const label = button.querySelector('b');
    if (label) label.textContent = playing ? 'PAUSE MUSIC' : 'PLAY MUSIC';
    const icon = button.matches('.music-fab') ? button.querySelector('span') : null;
    if (icon) icon.textContent = playing ? '\u275A\u275A' : '\u266B';
  });
}

document.querySelector('.open-invitation')?.addEventListener('click', () => {
  document.body.classList.add('invitation-opened');
  if (weddingSong instanceof HTMLAudioElement) {
    weddingSong.volume = 0.7;
    void weddingSong.play().then(updateMusicButton).catch(() => {});
  }
  window.setTimeout(() => opening?.setAttribute('hidden', ''), 2050);
});

const rsvpForm = document.querySelector('#rsvp-form');
const rsvpStatus = document.querySelector('#rsvp-status');
rsvpForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!(event.submitter instanceof HTMLButtonElement) || !(rsvpStatus instanceof HTMLElement)) return;
  const guestName = String(new FormData(rsvpForm).get('guestName') || '').trim();
  if (!guestName) {
    document.querySelector('#rsvp-guest-name')?.focus();
    rsvpStatus.textContent = 'Bạn nhập tên giúp chúng mình nhé.';
    rsvpStatus.dataset.error = 'true';
    return;
  }

  const buttons = rsvpForm.querySelectorAll('button[type="submit"]');
  buttons.forEach((button) => { button.disabled = true; });
  rsvpStatus.textContent = 'Đang gửi phản hồi…';
  delete rsvpStatus.dataset.error;
  try {
    const response = await fetch('/api/invitations/20260323-NDNL/rsvps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({ guestName, attending: event.submitter.value === 'true', guestCount: 1 }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Chưa gửi được phản hồi. Bạn thử lại nhé.');
    rsvpStatus.textContent = 'Cảm ơn bạn đã gửi lời hồi âm!';
    rsvpForm.reset();
  } catch (error) {
    rsvpStatus.textContent = error instanceof Error && error.name === 'TimeoutError'
      ? 'Kết nối hơi lâu, bạn thử gửi lại nhé.'
      : error instanceof Error ? error.message : 'Chưa gửi được phản hồi. Bạn thử lại nhé.';
    rsvpStatus.dataset.error = 'true';
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
});

musicToggles.forEach((musicToggle) => musicToggle.addEventListener('click', () => {
  if (!(weddingSong instanceof HTMLAudioElement)) return;
  if (weddingSong.paused) {
    weddingSong.volume = 0.7;
    void weddingSong.play().then(updateMusicButton).catch(() => {});
  } else {
    weddingSong.pause();
    updateMusicButton();
  }
}));

weddingSong?.addEventListener('play', updateMusicButton);
weddingSong?.addEventListener('pause', updateMusicButton);
updateMusicButton();
