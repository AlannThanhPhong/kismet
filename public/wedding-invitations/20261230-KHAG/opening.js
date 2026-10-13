(() => {
  const MESSAGE_TEXT = "You have a message";
  const openingRoot = document.getElementById("typewriter-opening");
  const typedTarget = document.getElementById("typed-message");
  const cursorEl = document.getElementById("typewriter-cursor");
  const assemblyEl = document.getElementById("typewriter-assembly");
  const paperSheet = document.getElementById("rising-paper-sheet");
  const envelopeBtn = document.getElementById("envelope-trigger");
  const replayBtn = document.getElementById("replay-typewriter-btn");
  const envelopeTransition = document.getElementById("envelope-transition");
  const envelope = document.querySelector(".opening-envelope");
  const mainInvitation = document.getElementById("main-invitation");
  const invitationTitle = document.getElementById("invitation-title");
  const music = document.getElementById("wedding-music");
  const musicToggle = document.getElementById("music-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!openingRoot || !typedTarget || !paperSheet || !envelopeBtn) return;

  let timers = [];
  let isOpeningEnvelope = false;
  let zoomAnimation = null;

  function syncMusicButton() {
    if (!music || !musicToggle) return;
    const playing = !music.paused;
    musicToggle.textContent = playing ? "Tắt nhạc" : "Bật nhạc";
    musicToggle.setAttribute("aria-pressed", String(playing));
  }

  function playMusic() {
    if (!music) return;
    if (musicToggle) musicToggle.hidden = false;
    music.play().catch(() => { syncMusicButton(); });
  }

  if (music) {
    music.volume = 0.55;
    music.addEventListener("play", syncMusicButton);
    music.addEventListener("pause", syncMusicButton);
    music.addEventListener("error", syncMusicButton);
  }
  if (musicToggle && music) {
    musicToggle.addEventListener("click", () => {
      if (music.paused) playMusic();
      else music.pause();
    });
  }

  function clearTimers() {
    timers.forEach((id) => clearTimeout(id));
    timers = [];
  }

  function schedule(fn, delay) {
    const id = setTimeout(fn, delay);
    timers.push(id);
    return id;
  }

  function startTypewriterSequence(focusEnvelope = false) {
    clearTimers();
    if (zoomAnimation) { zoomAnimation.cancel(); zoomAnimation = null; }
    isOpeningEnvelope = false;
    if (music && focusEnvelope === true) {
      music.pause();
      music.currentTime = 0;
    }

    document.body.classList.add("is-opening-locked");
    document.body.classList.remove("is-revealing-invitation");
    if (mainInvitation) mainInvitation.inert = true;
    if (envelopeTransition) {
      envelopeTransition.hidden = true;
      envelopeTransition.classList.remove("is-visible", "is-unsealed", "is-extracted");
    }
    if (envelope) {
      envelope.classList.remove("is-unsealed", "is-extracted", "is-zooming");
      envelope.classList.add("is-in-paper");
      envelopeBtn.append(envelope);
    }
    openingRoot.inert = false;
    openingRoot.classList.remove("is-dismissed", "is-ready-to-open", "is-zooming-away");
    envelopeBtn.classList.remove("is-opening");
    paperSheet.classList.remove("is-rising");
    if (cursorEl) cursorEl.classList.remove("is-done");
    if (assemblyEl) assemblyEl.classList.remove("is-typing-active");
    typedTarget.textContent = "";

    // Force layout reflow so paper starts tucked inside the typewriter roller
    void paperSheet.offsetWidth;
    if (focusEnvelope === true) envelopeBtn.focus({ preventScroll: true });

    if (reducedMotion) {
      typedTarget.textContent = MESSAGE_TEXT;
      paperSheet.classList.add("is-rising");
      openingRoot.classList.add("is-ready-to-open");
      if (cursorEl) cursorEl.classList.add("is-done");
      return;
    }

    // 1. Begin typing "You have a message" character by character
    let elapsed = 320;
    if (assemblyEl) {
      schedule(() => assemblyEl.classList.add("is-typing-active"), elapsed);
    }

    for (let i = 1; i <= MESSAGE_TEXT.length; i++) {
      const ch = MESSAGE_TEXT[i - 1];
      const stepDelay = ch === " " ? 115 : 78 + ((i * 19) % 35);
      elapsed += stepDelay;
      const currentSlice = MESSAGE_TEXT.slice(0, i);
      schedule(() => {
        typedTarget.textContent = currentSlice;
      }, elapsed);
    }

    // 2. Start feeding the paper slowly upwards out of the typewriter carriage
    // Begins right after the first few characters are typed (~680ms)
    const paperStartDelay = 680;
    schedule(() => {
      paperSheet.classList.add("is-rising");
    }, paperStartDelay);

    // Mark typing cursor done when text finishes
    schedule(() => {
      if (cursorEl) cursorEl.classList.add("is-done");
    }, elapsed + 150);

    // 3. When paper finishes rising (paperStartDelay + 4200ms), stop machine chatter and highlight envelope prompt
    const paperFinishTime = paperStartDelay + 4100;
    schedule(() => {
      if (assemblyEl) assemblyEl.classList.remove("is-typing-active");
      openingRoot.classList.add("is-ready-to-open");
    }, paperFinishTime);
  }

  function handleEnvelopeOpen() {
    if (isOpeningEnvelope) return;
    // Play within the actual click so mobile browsers retain user activation.
    playMusic();
    clearTimers();
    isOpeningEnvelope = true;

    // Ensure paper is fully risen if clicked early
    paperSheet.classList.add("is-rising");
    if (assemblyEl) assemblyEl.classList.remove("is-typing-active");

    if (!envelope || !envelopeTransition) return;
    // Start the contents rising together, then zoom after their two-second reveal.
    envelope.classList.add("is-unsealed", "is-extracted");
    const finish = () => {
      openingRoot.classList.add("is-dismissed");
      openingRoot.inert = true;
      envelope.classList.remove("is-zooming");
      if (mainInvitation) mainInvitation.inert = false;
      document.body.classList.remove("is-opening-locked");
      if (invitationTitle) invitationTitle.focus({ preventScroll: true });
    };
    function zoomIntoPage() {
      // Move the original envelope, preserving its screen rectangle with FLIP.
      const before = envelope.getBoundingClientRect();
      envelopeTransition.hidden = false;
      envelopeTransition.classList.add("is-visible");
      envelope.classList.remove("is-in-paper");
      envelope.classList.add("is-zooming");
      envelopeTransition.append(envelope);
      document.body.classList.add("is-revealing-invitation");
      openingRoot.classList.add("is-zooming-away");
      window.scrollTo({ top: 0, behavior: "instant" });
      const after = envelope.getBoundingClientRect();
      if (reducedMotion) { finish(); return; }
      zoomAnimation = envelope.animate([
        { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})` },
        { transform: "translate(0, 0) scale(1)" },
      ], { duration: 1800, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" });
      zoomAnimation.finished.then(() => {
        finish();
        zoomAnimation.cancel();
        zoomAnimation = null;
      }).catch(() => {});
    }
    if (reducedMotion) {
      envelope.classList.add("is-extracted");
      zoomIntoPage();
    } else {
      schedule(zoomIntoPage, 2200);
    }
  }

  envelopeBtn.addEventListener("click", handleEnvelopeOpen);

  // Use only the couple's supplied photos, preserving the original files.
  const album = document.getElementById("wedding-album");
  const photoTimes = ["15-06-10", "15-06-14", "15-06-17", "15-06-20", "15-06-23", "15-06-25", "15-06-28", "15-06-31", "15-06-33", "15-06-37", "15-06-40", "15-06-43", "15-06-46", "15-06-49", "15-06-54", "15-06-57", "15-06-58", "15-07-01", "15-07-03", "15-07-05", "15-07-07", "15-07-10"];
  if (album) {
    const usedPhotos = new Set(
      Array.from(document.querySelectorAll(".invitation img"))
        .filter((img) => img.compareDocumentPosition(album) & Node.DOCUMENT_POSITION_FOLLOWING)
        .map((img) => img.src)
    );
    const remainingPhotos = photoTimes.filter((time) =>
      !usedPhotos.has(new URL(`./images/photo_2026-10-12_${time}.jpg`, document.baseURI).href)
    );
    const more = document.createElement("details");
    more.className = "album-more";
    const summary = document.createElement("summary");
    summary.textContent = `VIEW ALL ${remainingPhotos.length} PHOTOS`;
    more.append(summary);
    const grid = document.createElement("div");
    grid.className = "album-more-grid";
    more.append(grid);
    remainingPhotos.forEach((time, index) => {
      const link = document.createElement("a");
      link.href = `./images/photo_2026-10-12_${time}.jpg`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Open wedding photo ${index + 1} in full size`);
      const img = document.createElement("img");
      img.src = link.href;
      img.alt = `An Huynh and Pham Anh — wedding memory ${index + 1}`;
      img.loading = "lazy";
      link.append(img);
      (index < 6 ? album : grid).append(link);
    });
    if (remainingPhotos.length > 6) album.append(more);
  }

  const countdown = document.getElementById("countdown");
  if (countdown) {
    const weddingTime = new Date("2026-12-30T17:30:00+07:00").getTime();
    function updateCountdown() {
      const seconds = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
      const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
      for (const [unit, value] of Object.entries(values)) {
        countdown.querySelector(`[data-count="${unit}"]`).textContent = String(value).padStart(2, "0");
      }
      countdown.hidden = false;
    }
    updateCountdown();
    setInterval(() => { if (!document.hidden) updateCountdown(); }, 1000);
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      startTypewriterSequence(true);
    });
  }

  // Launch sequence when entering the web
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startTypewriterSequence, { once: true });
  } else {
    startTypewriterSequence();
  }
})();
