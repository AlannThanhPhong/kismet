(() => {
  // 1. Opening Gate & Background Music: City Of Stars — May Finally Come True
  const coverGate = document.getElementById('diary-cover-gate');
  const openBtn = document.getElementById('diary-open-btn');
  const coverBoard = document.querySelector('.cover-burgundy-board');
  const bgm = document.getElementById('diary-bgm');
  const audioBtn = document.getElementById('diary-audio-btn');
  const audioLabel = document.getElementById('diary-audio-label');

  function updateAudioUi(playing) {
    if (!audioBtn) return;
    const title = (bgm && bgm.getAttribute('data-song-title')) || 'City Of Stars — May Finally Come True';
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

  let isGateOpened = false;
  function openLoversDiary() {
    if (isGateOpened) return;
    isGateOpened = true;

    // Start playing City Of Stars — May Finally Come True
    startMusicWithFadeIn();

    // Animate 3D diary cover opening & reveal invitation content
    if (coverGate) {
      coverGate.classList.add('is-opening');
    }
    document.body.classList.remove('is-locked');

    window.setTimeout(() => {
      if (coverGate) {
        coverGate.classList.add('is-opened');
      }
    }, 850);
  }

  if (openBtn) {
    openBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      openLoversDiary();
    });
  }

  if (coverBoard) {
    coverBoard.addEventListener('click', () => {
      openLoversDiary();
    });
  }

  // Floating Audio Button Toggle (Play / Pause City Of Stars)
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

  // 2. Lightbox for Polaroids, Postage Stamps & Collage Frames
  const lightbox = document.getElementById('diary-lightbox');
  const lightboxImg = document.getElementById('diary-lightbox-img');
  const lightboxCaption = document.getElementById('diary-lightbox-caption');
  const lightboxClose = document.getElementById('diary-lightbox-close');

  const clickableFrames = document.querySelectorAll('[data-lightbox-src]');
  clickableFrames.forEach((frame) => {
    frame.addEventListener('click', () => {
      const src = frame.getAttribute('data-lightbox-src');
      const caption = frame.getAttribute('data-lightbox-caption') || 'Élodie Laurent & Gabriel Moreau';
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

  // 3. RSVP Postcard Form Submission
  const rsvpForm = document.getElementById('diary-rsvp-form');
  const rsvpStatus = document.getElementById('diary-rsvp-status');

  if (rsvpForm && rsvpStatus) {
    rsvpForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(rsvpForm);
      const guestName = String(formData.get('guestName') || '').trim();
      const attendance = String(formData.get('attendance') || 'yes');
      const guestsCount = String(formData.get('guestsCount') || '1');
      const message = String(formData.get('message') || '').trim();

      if (!guestName) {
        rsvpStatus.textContent = 'Please sign your name on the postcard.';
        return;
      }

      try {
        const saved = JSON.parse(localStorage.getItem('lovers_diary_rsvps') || '[]');
        saved.push({
          guestName,
          attendance,
          guestsCount,
          message,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('lovers_diary_rsvps', JSON.stringify(saved));
      } catch {
        // Ignore storage errors in private browsing
      }

      rsvpStatus.textContent =
        attendance === 'yes'
          ? `Merci, ${guestName}! Your seat at Église Saint-Sulpice is reserved.`
          : `Merci, ${guestName}. Your warm wishes have been tucked into our diary.`;
      rsvpForm.reset();
    });
  }
})();
