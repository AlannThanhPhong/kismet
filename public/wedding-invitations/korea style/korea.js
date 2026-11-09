/* ==========================================================================
   Template #4 — KOREA STYLE · BOTANICAL ELEGANCE EDITION
   Couple: 김서연 (Kim Seo-yeon) & 이도윤 (Lee Do-yoon)
   Song: ONLY — LeeHi (music/leehi-only.mp3)
   ========================================================================== */

(function () {
  'use strict';

  const body = document.body;
  const coverGate = document.getElementById('korea-cover-gate');
  const envelopeBtn = document.getElementById('korea-key-btn');
  const envelopeCard = document.getElementById('korea-envelope-card');
  const envelopeBody = document.getElementById('korea-padlock');
  const envelopeFlap = document.getElementById('korea-key-pos');
  const waxSeal = document.getElementById('korea-keyhole-glow');
  const gateFlash = document.getElementById('korea-gate-flash');

  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicToggleText = document.getElementById('music-toggle-text');
  const vinylBtn = document.getElementById('vinyl-music-btn');
  const petalLayer = document.getElementById('korea-petal-layer');

  let isOpened = false;
  let isOpening = false;
  let isMusicPlaying = false;

  // Ensure all inline botanical GIF/video clips play smoothly
  function playAllBotanicalVideos() {
    document.querySelectorAll('video').forEach((v) => {
      v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    });
  }

  playAllBotanicalVideos();

  /* ------------------------------------------------------------------------
     1. CELEBRATORY PETAL SPARKS
     ------------------------------------------------------------------------ */
  function spawnGardenPetals(count = 20) {
    if (!petalLayer) return;
    const colors = ['#f9f6ec', '#dce3c8', '#7c284c', '#e6ead8', '#d7a98c'];
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement('span');
      p.className = 'korea-petal-spark';
      p.style.setProperty('--petal-color', colors[i % colors.length]);
      p.style.setProperty('--petal-x', `${10 + Math.random() * 80}%`);
      p.style.setProperty('--petal-y', `${5 + Math.random() * 35}%`);
      p.style.setProperty('--petal-dx', `${(Math.random() - 0.5) * 140}px`);
      p.style.setProperty('--petal-dy', `${120 + Math.random() * 200}px`);
      p.style.setProperty('--petal-delay', `${(i * 0.04).toFixed(2)}s`);
      petalLayer.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }
  }

  /* ------------------------------------------------------------------------
     2. BACKGROUND MUSIC (LeeHi — ONLY) & SPINNING VINYL SYNC
     ------------------------------------------------------------------------ */
  function updateMusicUI(playing) {
    isMusicPlaying = playing;
    if (musicToggle) {
      musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }
    if (musicToggleText) {
      musicToggleText.textContent = playing ? 'ONLY · 재생중' : 'ONLY · LeeHi';
    }
    if (vinylBtn) {
      vinylBtn.classList.toggle('is-playing', playing);
    }
  }

  function startMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.72;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => updateMusicUI(true))
        .catch(() => updateMusicUI(false));
    }
  }

  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      startMusic();
    } else {
      bgMusic.pause();
      updateMusicUI(false);
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  if (vinylBtn) {
    vinylBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  /* ------------------------------------------------------------------------
     3. OLIVE ENVELOPE OPENING SEQUENCE
     ------------------------------------------------------------------------ */
  function openInvitation() {
    if (isOpened || isOpening) return;
    isOpening = true;

    startMusic();
    playAllBotanicalVideos();

    if (waxSeal) waxSeal.classList.add('is-active');
    if (envelopeFlap) envelopeFlap.classList.add('is-turning');
    if (envelopeBody) envelopeBody.classList.add('is-unlocked');
    if (gateFlash) gateFlash.classList.add('is-flashing');

    setTimeout(() => {
      isOpened = true;
      body.classList.remove('invitation-closed');
      if (coverGate) {
        coverGate.classList.add('is-opened');
        setTimeout(() => {
          coverGate.hidden = true;
        }, 850);
      }
      spawnGardenPetals(26);
    }, 520);
  }

  if (envelopeBtn) {
    envelopeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openInvitation();
    });
  }

  if (envelopeCard) {
    envelopeCard.addEventListener('click', () => {
      openInvitation();
    });
  }

  if (coverGate) {
    coverGate.addEventListener('click', (e) => {
      if (e.target === coverGate) {
        openInvitation();
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. LIGHTBOX MODAL FOR GALLERY PHOTOS
     ------------------------------------------------------------------------ */
  const lightbox = document.getElementById('korea-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const photoItems = Array.from(document.querySelectorAll('[data-full]'));
  let currentPhotoIdx = 0;

  function showPhotoAt(index) {
    if (!photoItems.length || !lightboxImg) return;
    currentPhotoIdx = (index + photoItems.length) % photoItems.length;
    const item = photoItems[currentPhotoIdx];
    const src = item.getAttribute('data-full');
    const caption = item.getAttribute('data-caption') || '';
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }
  }

  photoItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (!lightbox) return;
      showPhotoAt(index);
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
      } else {
        lightbox.setAttribute('open', '');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.close());
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => showPhotoAt(currentPhotoIdx - 1));
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => showPhotoAt(currentPhotoIdx + 1));
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
  }

  /* ------------------------------------------------------------------------
     5. RSVP FORM SUBMISSION
     ------------------------------------------------------------------------ */
  const rsvpForm = document.getElementById('korea-rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(rsvpForm);
      const guestName = (formData.get('name') || '').toString().trim() || '소중한 하객';
      if (rsvpStatus) {
        rsvpStatus.textContent = `${guestName}님, 따뜻한 축복과 참석 의사 전달에 깊이 감사드립니다.`;
      }
      spawnGardenPetals(18);
      rsvpForm.reset();
    });
  }
})();
