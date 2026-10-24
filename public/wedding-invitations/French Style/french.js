(() => {
  // 1. Opening Envelope Gate & Background Music
  const coverGate = document.getElementById('french-cover-gate');
  const openBtn = document.getElementById('french-open-btn');
  const openTrigger = document.getElementById('french-open-trigger');
  const bgm = document.getElementById('diary-bgm');
  const audioBtn = document.getElementById('diary-audio-btn');
  const audioLabel = document.getElementById('diary-audio-label');

  function updateAudioUi(playing) {
    if (!audioBtn) return;
    const title = (bgm && bgm.getAttribute('data-song-title')) || 'Qui se souvient de cette ruelle';
    if (playing) {
      audioBtn.classList.add('is-playing');
      audioBtn.setAttribute('title', `Đang phát: ${title} (Chạm để tắt nhạc)`);
      if (audioLabel) audioLabel.textContent = `♪ ${title} · On`;
    } else {
      audioBtn.classList.remove('is-playing');
      audioBtn.setAttribute('title', `Đang tắt: ${title} (Chạm để bật nhạc)`);
      if (audioLabel) audioLabel.textContent = `♪ ${title} · Off`;
    }
  }

  function startMusicWithFadeIn() {
    if (!bgm) return;
    bgm.volume = 0.15;
    const playPromise = bgm.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          updateAudioUi(true);
          let vol = 0.15;
          const fadeTimer = window.setInterval(() => {
            vol = Math.min(0.85, vol + 0.08);
            bgm.volume = vol;
            if (vol >= 0.85) {
              clearInterval(fadeTimer);
            }
          }, 120);
        })
        .catch(() => {
          updateAudioUi(false);
        });
    }
  }

  let isFlapOpened = false;
  let isInvitationEntered = false;

  function openFrenchEnvelope() {
    if (isFlapOpened) return;
    isFlapOpened = true;

    startMusicWithFadeIn();

    if (coverGate) {
      coverGate.classList.add('is-opening');
    }

    // After 3D flap flip & card rise, reveal the enter button
    window.setTimeout(() => {
      if (coverGate) {
        coverGate.classList.add('is-revealed');
      }
    }, 700);
  }

  function enterInvitation() {
    if (isInvitationEntered) return;
    isInvitationEntered = true;

    if (coverGate) {
      coverGate.classList.add('is-opened');
    }
    document.body.classList.remove('is-locked');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (window.location.search.includes('open=1')) {
    isFlapOpened = true;
    isInvitationEntered = true;
    if (coverGate) {
      coverGate.classList.add('is-opening', 'is-revealed', 'is-opened');
    }
    document.body.classList.remove('is-locked');
  } else if (window.location.search.includes('reveal=1')) {
    isFlapOpened = true;
    if (coverGate) {
      coverGate.classList.add('is-opening', 'is-revealed');
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      openFrenchEnvelope();
    });
  }

  if (openTrigger) {
    openTrigger.addEventListener('click', () => {
      if (!isFlapOpened) {
        openFrenchEnvelope();
      } else if (coverGate && coverGate.classList.contains('is-revealed')) {
        enterInvitation();
      }
    });
  }

  const enterBtn = document.getElementById('french-enter-btn');
  if (enterBtn) {
    enterBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      enterInvitation();
    });
  }

  const letterCard = document.getElementById('french-letter-card');
  if (letterCard) {
    letterCard.addEventListener('click', (event) => {
      if (isFlapOpened) {
        event.stopPropagation();
        enterInvitation();
      }
    });
  }

  // Circular Audio Toggle Button
  if (audioBtn && bgm) {
    audioBtn.addEventListener('click', () => {
      if (bgm.paused) {
        bgm.volume = 0.85;
        bgm
          .play()
          .then(() => updateAudioUi(true))
          .catch(() => updateAudioUi(false));
      } else {
        bgm.pause();
        updateAudioUi(false);
      }
    });
  }

  // 2. Lightbox for Cameo, Triptych & Salon Portraits
  const lightbox = document.getElementById('french-lightbox');
  const lightboxImg = document.getElementById('french-lightbox-img');
  const lightboxCaption = document.getElementById('french-lightbox-caption');
  const lightboxClose = document.getElementById('french-lightbox-close');

  const clickableFrames = document.querySelectorAll('[data-lightbox-src]');
  clickableFrames.forEach((frame) => {
    frame.addEventListener('click', () => {
      const src = frame.getAttribute('data-lightbox-src');
      const caption = frame.getAttribute('data-lightbox-caption') || 'Élise Beaumont & Julien Laurent';
      if (!lightbox || !lightboxImg || !src) return;
      lightboxImg.src = src;
      lightboxImg.alt = caption;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
      }
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      }
    });
  });

  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });
  }

  // 3. French RSVP Form Submission
  const rsvpForm = document.getElementById('french-rsvp-form');
  const rsvpStatus = document.getElementById('french-rsvp-status');

  if (rsvpForm && rsvpStatus) {
    rsvpForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(rsvpForm);
      const guestName = (formData.get('guestName') || 'Chère invitée').toString().trim();
      const attendance = formData.get('attendance');

      if (attendance === 'declines') {
        rsvpStatus.textContent = `Merci, ${guestName} — we will hold you in our hearts in Paris.`;
      } else {
        rsvpStatus.textContent = `Merci beaucoup, ${guestName} — we look forward to welcoming you in Paris!`;
      }
      rsvpForm.reset();
    });
  }

  // 4. Live Countdown Timer ("Forever starts in")
  const cdContainer = document.getElementById('french-countdown');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    if (!cdContainer || !cdDays || !cdHours || !cdMinutes || !cdSeconds) return;
    const targetRaw = cdContainer.getAttribute('data-target') || '2026-10-22T16:46:00+02:00';
    const targetMs = new Date(targetRaw).getTime();
    const nowMs = Date.now();
    const diff = Math.max(0, targetMs - nowMs);

    if (diff <= 0) {
      // Show a poetic live ticker if current date is on/after the wedding date
      cdDays.textContent = '365';
      cdHours.textContent = '08';
      cdMinutes.textContent = '46';
      const sec = 59 - (Math.floor(nowMs / 1000) % 60);
      cdSeconds.textContent = String(sec).padStart(2, '0');
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    cdDays.textContent = String(days);
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();
