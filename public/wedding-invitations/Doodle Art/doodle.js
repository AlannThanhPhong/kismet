/* ==========================================================================
   Template #5 — DOODLE ART · WHIMSICAL ILLUSTRATED WEDDING INVITATION
   Couple: Gabriel Moreau & Amélie Laurent
   Date: June 12, 2027 · 17:00 CEST (Château Belle Étoile, France)
   ========================================================================== */

(function () {
  'use strict';

  const body = document.body;
  const coverGate = document.getElementById('ks-opening-gate');
  const openBtn = document.getElementById('ks-open-btn');
  const gateFlash = document.getElementById('ks-gate-flash');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicToggleText = document.getElementById('music-toggle-text');
  const confettiLayer = document.getElementById('ks-confetti-layer');
  const calGrid = document.getElementById('ks-calendar-grid');
  const rsvpForm = document.getElementById('ks-rsvp-form');
  const rsvpStatus = document.getElementById('rsvp-status');

  let isOpened = false;
  let isOpening = false;
  let isMusicPlaying = false;

  /* ------------------------------------------------------------------------
     1. CELEBRATORY CONFETTI / FLOWER PETALS (Palette Colors)
     ------------------------------------------------------------------------ */
  function spawnConfetti(count = 24) {
    if (!confettiLayer) return;
    const colors = ['#A3C6DF', '#A8BC7A', '#F3C4CE', '#C86D98', '#FAF6EF'];
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement('span');
      p.className = 'ks-confetti-particle';
      p.style.backgroundColor = colors[i % colors.length];
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.top = `${10 + Math.random() * 40}%`;
      p.style.setProperty('--cf-dx', `${(Math.random() - 0.5) * 160}px`);
      p.style.setProperty('--cf-dy', `${140 + Math.random() * 220}px`);
      confettiLayer.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }
  }

  /* ------------------------------------------------------------------------
     2. BACKGROUND MUSIC TOGGLE (Young and Beautiful)
     ------------------------------------------------------------------------ */
  function updateMusicUI(playing) {
    isMusicPlaying = playing;
    if (musicToggle) {
      musicToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }
    if (musicToggleText) {
      musicToggleText.textContent = playing ? 'Playing ♪' : 'Young & Beautiful';
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

  /* ------------------------------------------------------------------------
     3. OPEN INVITATION SEQUENCE
     ------------------------------------------------------------------------ */
  function openInvitation() {
    if (isOpened || isOpening) return;
    isOpening = true;

    startMusic();
    if (gateFlash) gateFlash.classList.add('is-flashing');

    setTimeout(() => {
      isOpened = true;
      body.classList.remove('invitation-closed');
      if (coverGate) {
        coverGate.classList.add('is-opened');
        setTimeout(() => {
          coverGate.hidden = true;
        }, 750);
      }
      spawnConfetti(28);
    }, 450);
  }

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
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
     4. JUNE 2027 CALENDAR GENERATION (Highlight Day 12)
     ------------------------------------------------------------------------ */
  function buildCalendar() {
    if (!calGrid) return;
    calGrid.innerHTML = '';

    // June 2027:
    // June 1 is Tuesday.
    // In Monday-first week (M, T, W, T, F, S, S):
    // June 1 is index 1 (0=Mon, 1=Tue).
    const startDayIndex = 1; // 1 empty cell before 1st
    const totalDays = 30;
    const weddingDay = 12; // Saturday, June 12

    for (let i = 0; i < startDayIndex; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'ks-cal-cell is-empty';
      calGrid.appendChild(cell);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const cell = document.createElement('div');
      cell.className = 'ks-cal-cell';
      cell.textContent = String(day);
      if (day === weddingDay) {
        cell.classList.add('is-wedding-date');
        cell.setAttribute('aria-label', `Wedding day: June ${day}, 2027`);
      }
      calGrid.appendChild(cell);
    }
  }

  buildCalendar();

  /* ------------------------------------------------------------------------
     5. LIVE WEDDING COUNTDOWN TIMER
     Target: June 12, 2027 at 17:00:00 CEST (UTC+2)
     ------------------------------------------------------------------------ */
  const weddingDate = new Date('2027-06-12T17:00:00+02:00').getTime();
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMins) elMins.textContent = '00';
      if (elSecs) elSecs.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ------------------------------------------------------------------------
     6. RSVP FORM SUBMISSION
     ------------------------------------------------------------------------ */
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(rsvpForm);
      const name = (formData.get('name') || '').toString().trim() || 'Cher invité';
      const attendance = formData.get('attendance');

      if (rsvpStatus) {
        if (attendance === 'attending') {
          rsvpStatus.textContent = `Thank you, ${name}! Your warm presence means the world to us. (Merci beaucoup pour votre présence !)`;
        } else {
          rsvpStatus.textContent = `Thank you, ${name}! Your heartfelt blessings are deeply appreciated. (Merci de tout cœur pour vos vœux !)`;
        }
      }

      spawnConfetti(26);
      rsvpForm.reset();
    });
  }

  // Auto open if URL has ?open=true for visual verification
  if (window.location.search.includes('open=true')) {
    body.classList.remove('invitation-closed');
    if (coverGate) coverGate.hidden = true;
    isOpened = true;
  }
})();
