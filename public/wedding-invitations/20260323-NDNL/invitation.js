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
