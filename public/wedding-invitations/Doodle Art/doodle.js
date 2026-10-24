/**
 * KOREA STYLE — WEDDING INVITATION INTERACTIVE SCRIPTS
 * Whimsical Hand-Drawn Doodle Style
 * Music: Young and Beautiful (Instrumental)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const body = document.body;
  const gateCover = document.getElementById('gate-cover');
  const btnOpenInvitation = document.getElementById('btn-open-invitation');
  const gateCarStage = document.getElementById('gate-car-stage');
  const weddingMusic = document.getElementById('wedding-music');
  const audioDock = document.getElementById('audio-dock');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const toastMessage = document.getElementById('toast-message');

  // State
  let isGateOpened = false;

  // -------------------------------------------------------------------------
  // 1. OPENING GATE INTERACTION
  // -------------------------------------------------------------------------
  function openInvitation() {
    if (isGateOpened) return;
    isGateOpened = true;

    // Start audio immediately within user gesture context
    if (weddingMusic) {
      weddingMusic.volume = 0.85;
      weddingMusic.play().then(() => {
        if (audioDock) audioDock.classList.add('is-playing');
      }).catch((err) => {
        console.warn('Audio playback deferred:', err);
      });
    }

    // Car drive & smoke animation
    if (gateCarStage) {
      gateCarStage.classList.add('car-rolling');
    }

    // Slide up and dissolve gate
    setTimeout(() => {
      body.classList.remove('invitation-closed');
      body.classList.add('invitation-opened');

      // Scroll smoothly to top of main content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 650);

    // Completely hide gate from accessibility tree after transition
    setTimeout(() => {
      if (gateCover) {
        gateCover.style.display = 'none';
      }
    }, 1500);
  }

  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener('click', openInvitation);
  }
  if (gateCarStage) {
    gateCarStage.addEventListener('click', openInvitation);
  }

  // -------------------------------------------------------------------------
  // 2. AUDIO PLAY / PAUSE CONTROLS
  // -------------------------------------------------------------------------
  if (btnAudioToggle && weddingMusic) {
    btnAudioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (weddingMusic.paused) {
        weddingMusic.play().then(() => {
          if (audioDock) audioDock.classList.add('is-playing');
          showToast('♪ Now Playing: Young and Beautiful');
        }).catch(console.warn);
      } else {
        weddingMusic.pause();
        if (audioDock) audioDock.classList.remove('is-playing');
        showToast('Music Paused');
      }
    });

    weddingMusic.addEventListener('play', () => {
      if (audioDock) audioDock.classList.add('is-playing');
    });

    weddingMusic.addEventListener('pause', () => {
      if (audioDock) audioDock.classList.remove('is-playing');
    });

    weddingMusic.addEventListener('ended', () => {
      // Loop is handled by audio tag, but if it ends:
      if (audioDock) audioDock.classList.remove('is-playing');
    });
  }

  // -------------------------------------------------------------------------
  // 3. REALTIME COUNTDOWN TIMER (Target: 2027-06-12 16:00:00 CEST)
  // -------------------------------------------------------------------------
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  // June 12, 2027 16:00:00 CEST
  const targetDate = new Date('2027-06-12T16:00:00+02:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------------------
  // 4. COPY BANK ACCOUNT NUMBERS
  // -------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.btn-copy-account');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback
          const tempInput = document.createElement('input');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        btn.textContent = 'Copied! ✓';
        btn.style.background = '#4d7c57';
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.style.background = '';
        }, 2200);
        showToast('Details copied to clipboard!');
      } catch (err) {
        showToast(textToCopy);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 5. WEDDING PHOTO GALLERY LIGHTBOX
  // -------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('#gallery-grid .gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const btnLbClose = document.getElementById('btn-lightbox-close');
  const btnLbPrev = document.getElementById('btn-lb-prev');
  const btnLbNext = document.getElementById('btn-lb-next');

  let currentPhotoIndex = 0;
  const photoSrcs = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      photoSrcs.push(img.src);
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal || !lightboxImg || photoSrcs.length === 0) return;
    currentPhotoIndex = index;
    lightboxImg.src = photoSrcs[currentPhotoIndex];
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoSrcs.length}`;
    }
    lightboxModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function showNextPhoto() {
    if (photoSrcs.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + 1) % photoSrcs.length;
    if (lightboxImg) lightboxImg.src = photoSrcs[currentPhotoIndex];
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoSrcs.length}`;
    }
  }

  function showPrevPhoto() {
    if (photoSrcs.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex - 1 + photoSrcs.length) % photoSrcs.length;
    if (lightboxImg) lightboxImg.src = photoSrcs[currentPhotoIndex];
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photoSrcs.length}`;
    }
  }

  if (btnLbClose) btnLbClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (btnLbNext) btnLbNext.addEventListener('click', showNextPhoto);
  if (btnLbPrev) btnLbPrev.addEventListener('click', showPrevPhoto);

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || lightboxModal.hasAttribute('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // -------------------------------------------------------------------------
  // 6. RSVP FORM SUBMISSION
  // -------------------------------------------------------------------------
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccessBox = document.getElementById('rsvp-success-box');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-name');
      const phoneInput = document.getElementById('rsvp-phone');

      if (!nameInput || !nameInput.value.trim()) {
        showToast('Please enter your full name.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phoneInput || !phoneInput.value.trim()) {
        showToast('Please enter your contact information.');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Smooth transition to success
      rsvpForm.style.opacity = '0.4';
      rsvpForm.style.pointerEvents = 'none';

      setTimeout(() => {
        rsvpForm.hidden = true;
        if (rsvpSuccessBox) {
          rsvpSuccessBox.hidden = false;
        }
        showToast('💌 Thank you! Your RSVP has been received.');
      }, 400);
    });
  }

  // -------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION HELPER
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    if (!toastMessage) return;
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2800);
  }
});
