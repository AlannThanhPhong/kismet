/**
 * Template 03 — Coquette Garden & Vintage Lace Wedding Invitation
 * Couple: Amélie Laurent & Theodore Whitmore
 * Date: Friday, 24th September 2027
 * Venue: St Mary’s Church, West Kensington, London (https://www.smwk.org/weddings)
 * Music: "Young and Beautiful" (/music/wedding/young-and-beautiful.mp3)
 */
(function () {
  'use strict';

  const body = document.body;
  const coverGate = document.getElementById('coquette-cover-gate');
  const openTrigger = document.getElementById('coquette-open-trigger');
  const openBtn = document.getElementById('coquette-open-btn');
  const openText = document.getElementById('coquette-open-text');
  const reopenBtn = document.getElementById('coquette-reopen-envelope');

  const audio = document.getElementById('diary-bgm');
  const audioBtn = document.getElementById('diary-audio-btn');
  const audioLabel = document.getElementById('diary-audio-label');

  let isGateOpening = false;
  let fadeTimer = null;

  /* ------------------------------------------------------------------------
     1. BACKGROUND MUSIC ("Young and Beautiful") & AUDIO TOGGLE
     ------------------------------------------------------------------------ */
  function syncAudioUI(playing) {
    if (!audioBtn) return;
    audioBtn.classList.toggle('is-playing', Boolean(playing));
    if (audioLabel) {
      const title = (audio && audio.getAttribute('data-song-title')) || 'Young and Beautiful';
      audioLabel.textContent = playing ? `♪ ${title}` : `♪ ${title} · Off`;
    }
  }

  function fadeInMusic() {
    if (!audio) return;
    if (fadeTimer) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
    try {
      audio.volume = 0.08;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            syncAudioUI(true);
            let vol = 0.08;
            fadeTimer = window.setInterval(() => {
              vol = Math.min(0.76, vol + 0.06);
              audio.volume = vol;
              if (vol >= 0.76 && fadeTimer) {
                clearInterval(fadeTimer);
                fadeTimer = null;
              }
            }, 110);
          })
          .catch(() => {
            syncAudioUI(false);
          });
      }
    } catch {
      syncAudioUI(false);
    }
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      fadeInMusic();
    } else {
      if (fadeTimer) {
        clearInterval(fadeTimer);
        fadeTimer = null;
      }
      audio.pause();
      syncAudioUI(false);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  if (audio) {
    audio.addEventListener('play', () => syncAudioUI(true));
    audio.addEventListener('pause', () => syncAudioUI(false));
  }

  /* ------------------------------------------------------------------------
     2. OPENING LACE ENVELOPE GATE & "BACK TO ENVELOPE" REPLAY
     ------------------------------------------------------------------------ */
  function openCoquetteEnvelope() {
    if (!coverGate || isGateOpening) return;
    isGateOpening = true;

    fadeInMusic();
    coverGate.classList.add('is-opening');

    window.setTimeout(() => {
      coverGate.classList.add('is-hidden');
      body.classList.remove('is-locked');
    }, 680);
  }

  function reopenCoquetteEnvelope() {
    if (!coverGate) return;
    isGateOpening = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    coverGate.classList.remove('is-hidden', 'is-opening');
    body.classList.add('is-locked');
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCoquetteEnvelope();
    });
  }

  if (openTrigger) {
    openTrigger.addEventListener('click', () => {
      openCoquetteEnvelope();
    });
  }

  if (openText) {
    openText.addEventListener('click', () => {
      openCoquetteEnvelope();
    });
  }

  if (reopenBtn) {
    reopenBtn.addEventListener('click', () => {
      reopenCoquetteEnvelope();
    });
  }

  /* ------------------------------------------------------------------------
     3. LIVE COUNTDOWN TO 24TH SEPTEMBER 2027 (LONDON TIME)
     ------------------------------------------------------------------------ */
  const countdownRoot = document.getElementById('coquette-countdown');
  const daysEl = document.getElementById('coq-days');
  const hoursEl = document.getElementById('coq-hours');
  const minutesEl = document.getElementById('coq-minutes');
  const secondsEl = document.getElementById('coq-seconds');

  function updateCountdown() {
    if (!countdownRoot) return;
    const rawTarget = countdownRoot.getAttribute('data-target') || '2027-09-24T14:00:00+01:00';
    const targetTime = new Date(rawTarget).getTime();
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------------
     4. LIGHTBOX MODAL FOR PORTRAITS
     ------------------------------------------------------------------------ */
  const lightbox = document.getElementById('coquette-lightbox');
  const lightboxImg = document.getElementById('coquette-lightbox-img');
  const lightboxCaption = document.getElementById('coquette-lightbox-caption');
  const lightboxClose = document.getElementById('coquette-lightbox-close');

  document.querySelectorAll('[data-lightbox-src]').forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target && e.target.closest('a, button')) return;
      const src = item.getAttribute('data-lightbox-src');
      const caption = item.getAttribute('data-lightbox-caption') || '';
      if (!src || !lightbox || !lightboxImg) return;

      lightboxImg.src = src;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', 'open');
      }
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === 'function') {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. INTERACTIVE RSVP FORM
     ------------------------------------------------------------------------ */
  const rsvpForm = document.getElementById('coquette-rsvp-form');
  const rsvpStatus = document.getElementById('coquette-rsvp-status');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(rsvpForm);
      const guestName = String(formData.get('guestName') || '').trim() || 'Dear Guest';
      const attendance = String(formData.get('attendance') || 'accepts');

      if (rsvpStatus) {
        if (attendance === 'declines') {
          rsvpStatus.textContent = `Thank you, ${guestName}. Your warm wishes have been sent to Amélie & Theodore.`;
        } else {
          rsvpStatus.textContent = `Thank you, ${guestName}! We look forward to welcoming you at St Mary’s Church, West Kensington on 24th September 2027.`;
        }
      }
      rsvpForm.reset();
    });
  }
})();
