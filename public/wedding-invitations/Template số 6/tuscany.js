/**
 * AMELIA & THOMAS — TUSCANY EDITORIAL WEDDING INVITATION
 * Interactive Client Scripts
 * Villa La Fiora · Tuscany, Italy
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const body = document.body;
  const gateOverlay = document.getElementById('gate-overlay');
  const btnOpenSeal = document.getElementById('btn-open-seal');
  const weddingMusic = document.getElementById('wedding-music');
  const audioDock = document.getElementById('audio-dock');
  const btnAudioDisc = document.getElementById('btn-audio-disc');
  const tuscanyToast = document.getElementById('tuscany-toast');

  let isGateOpened = false;

  // ---------------------------------------------------------------------------
  // 1. WAX SEAL & INVITATION UNVEILING
  // ---------------------------------------------------------------------------
  function openInvitation() {
    if (isGateOpened) return;
    isGateOpened = true;

    // Start audio playback within user gesture context
    if (weddingMusic) {
      weddingMusic.volume = 0.85;
      weddingMusic.play().then(() => {
        if (audioDock) audioDock.classList.add('is-playing');
      }).catch((err) => {
        console.warn('Audio playback deferred:', err);
      });
    }

    // Wax seal click animation
    if (btnOpenSeal) {
      btnOpenSeal.style.transform = 'scale(0.92)';
      setTimeout(() => {
        btnOpenSeal.style.transform = 'scale(1.15)';
      }, 150);
    }

    // Slide and dissolve gate envelope
    setTimeout(() => {
      body.classList.remove('invitation-closed');
      body.classList.add('invitation-opened');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);

    // Hide gate from accessibility tree after transition completes
    setTimeout(() => {
      if (gateOverlay) {
        gateOverlay.style.display = 'none';
      }
    }, 1200);
  }

  if (btnOpenSeal) {
    btnOpenSeal.addEventListener('click', openInvitation);
  }

  // Also support tapping anywhere on the card or pressing Enter
  const envelopeCard = document.querySelector('.envelope-card');
  if (envelopeCard) {
    envelopeCard.addEventListener('click', (e) => {
      if (!isGateOpened) openInvitation();
    });
  }

  // ---------------------------------------------------------------------------
  // 2. AUDIO PLAY / PAUSE CONTROLS
  // ---------------------------------------------------------------------------
  if (btnAudioDisc && weddingMusic) {
    btnAudioDisc.addEventListener('click', (e) => {
      e.stopPropagation();
      if (weddingMusic.paused) {
        weddingMusic.play().then(() => {
          if (audioDock) audioDock.classList.add('is-playing');
          showToast('♪ Playing City of Stars');
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
      if (audioDock) audioDock.classList.remove('is-playing');
    });
  }

  // ---------------------------------------------------------------------------
  // 3. THE WEEKEND DETAILS DRAWER TOGGLE
  // ---------------------------------------------------------------------------
  const btnToggleDetails = document.getElementById('btn-toggle-details');
  const weekendDrawer = document.getElementById('weekend-drawer');

  if (btnToggleDetails && weekendDrawer) {
    btnToggleDetails.addEventListener('click', () => {
      const isHidden = weekendDrawer.hasAttribute('hidden');
      if (isHidden) {
        weekendDrawer.removeAttribute('hidden');
        btnToggleDetails.querySelector('span').textContent = 'HIDE DETAILS ←';
      } else {
        weekendDrawer.setAttribute('hidden', '');
        btnToggleDetails.querySelector('span').textContent = 'VIEW FULL DETAILS →';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 4. RSVP FORM SUBMISSION
  // ---------------------------------------------------------------------------
  const rsvpForm = document.getElementById('editorial-rsvp-form');
  const rsvpConfirmCard = document.getElementById('rsvp-confirm-card');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-guest-name');

      if (!nameInput || !nameInput.value.trim()) {
        showToast('Please enter your name');
        if (nameInput) nameInput.focus();
        return;
      }

      // Smooth transition to confirmation state
      rsvpForm.style.opacity = '0.35';
      rsvpForm.style.pointerEvents = 'none';

      setTimeout(() => {
        rsvpForm.hidden = true;
        if (rsvpConfirmCard) {
          rsvpConfirmCard.hidden = false;
        }
        showToast('❦ Grazie! Your RSVP has been received.');
      }, 350);
    });
  }

  // ---------------------------------------------------------------------------
  // 5. NAVBAR ACTIVE STATE & SMOOTH SCROLL
  // ---------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.editorial-nav .nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = 'hero';
    const scrollPos = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });

  // ---------------------------------------------------------------------------
  // 6. TOAST NOTIFICATION HELPER
  // ---------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    if (!tuscanyToast) return;
    tuscanyToast.textContent = msg;
    tuscanyToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      tuscanyToast.classList.remove('show');
    }, 2800);
  }
});
