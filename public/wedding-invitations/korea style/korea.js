(() => {
  const music = document.getElementById("wedding-music");
  const musicToggle = document.getElementById("korea-music-toggle");
  const openingScreen = document.getElementById("korea-cover-gate");
  const keyBtn = document.getElementById("gate-key");
  const keyPos = document.getElementById("gate-key-pos");
  const lock = document.getElementById("gate-lock");
  const glow = document.getElementById("gate-glow");
  const burst = document.getElementById("gate-burst");
  const flash = document.getElementById("gate-flash");
  const openingHint = document.getElementById("opening-hint");
  const petalLayer = document.getElementById("korea-petal-layer");
  const gateDust = document.getElementById("gate-dust");

  let isOpened = false;
  let isUnlocking = false;
  let musicStarting = false;

  if (music instanceof HTMLAudioElement) {
    music.volume = 0.6;
  }

  // Populate floating golden dust in the gate background
  if (gateDust) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 40; i += 1) {
      const spark = document.createElement("span");
      spark.className = "gate-dust-spark";
      const left = (Math.random() * 100).toFixed(1);
      const top = (Math.random() * 100).toFixed(1);
      const size = (2 + Math.random() * 4.5).toFixed(1);
      const dur = (3 + Math.random() * 5).toFixed(1);
      const delay = (Math.random() * -6).toFixed(1);
      const opacity = (0.25 + Math.random() * 0.7).toFixed(2);
      spark.style.cssText = `left:${left}%;top:${top}%;width:${size}px;height:${size}px;--dust-dur:${dur}s;--dust-delay:${delay}s;--dust-alpha:${opacity}`;
      fragment.appendChild(spark);
    }
    gateDust.appendChild(fragment);
  }

  function updateMusicUi() {
    if (!(music instanceof HTMLAudioElement)) return;
    const playing = !music.paused;
    const songTitle = music.getAttribute("data-song-title") || "ONLY — LeeHi";

    if (musicToggle) {
      musicToggle.setAttribute("aria-pressed", String(playing));
      musicToggle.setAttribute(
        "aria-label",
        playing ? `음악 일시정지 (${songTitle}) · Pause Music` : `음악 재생 (${songTitle}) · Play Music`
      );
      const label = musicToggle.querySelector(".music-label");
      if (label) {
        label.textContent = playing ? `${songTitle} · ON` : `${songTitle} · OFF`;
      }
    }
  }

  async function startMusic() {
    if (!(music instanceof HTMLAudioElement) || musicStarting) return;
    musicStarting = true;
    try {
      await music.play();
      updateMusicUi();
    } catch {
      updateMusicUi();
    } finally {
      musicStarting = false;
    }
  }

  function launchCelebrationPetals() {
    if (!petalLayer) return;
    petalLayer.replaceChildren();
    const colors = ["#fff6cf", "#f6d57f", "#dce8d0", "#cf9b33", "#ffffff", "#f1aeb5"];
    for (let i = 0; i < 32; i += 1) {
      const petal = document.createElement("span");
      petal.className = "korea-petal-spark";
      const x = 5 + Math.random() * 90;
      const y = 5 + Math.random() * 35;
      const dx = (Math.random() - 0.5) * 220;
      const dy = 140 + Math.random() * 260;
      const delay = (Math.random() * 0.5).toFixed(2);
      petal.style.cssText = `--petal-x:${x}%;--petal-y:${y}%;--petal-dx:${dx}px;--petal-dy:${dy}px;--petal-color:${
        colors[i % colors.length]
      };--petal-delay:${delay}s`;
      petalLayer.appendChild(petal);
    }
    window.setTimeout(() => {
      petalLayer.replaceChildren();
    }, 2800);
  }

  function launchGateBurstParticles() {
    if (!burst) return;
    burst.replaceChildren();
    const colors = ["#ffffff", "#fff3bf", "#ffd56b", "#e5aa32", "#ffe49e"];
    for (let i = 0; i < 48; i += 1) {
      const p = document.createElement("span");
      p.className = "gate-burst-particle";
      const angle = (i / 48) * 360 + (Math.random() - 0.5) * 15;
      const dist = 70 + Math.random() * 210;
      const rad = (angle * Math.PI) / 180;
      const dx = Math.round(Math.cos(rad) * dist);
      const dy = Math.round(Math.sin(rad) * dist);
      const sz = (2.5 + Math.random() * 4.5).toFixed(1);
      const col = colors[Math.floor(Math.random() * colors.length)];
      const dur = (0.65 + Math.random() * 0.45).toFixed(2);
      p.style.cssText = `--p-dx:${dx}px;--p-dy:${dy}px;--p-sz:${sz}px;--p-col:${col};--p-dur:${dur}s`;
      burst.appendChild(p);
    }
  }

  function unlockAndOpen() {
    if (isUnlocking || isOpened) return;
    isUnlocking = true;

    // Start playback immediately on user gesture
    void startMusic();

    // Calculate dynamic offset from floating key to padlock keyhole
    const keyhole = document.getElementById("gate-keyhole-core") || document.getElementById("gate-keyhole-svg");
    if (keyBtn && keyhole && keyPos) {
      const kRect = keyBtn.getBoundingClientRect();
      const hRect = keyhole.getBoundingClientRect();
      // Target keyhole center
      const kCenterX = kRect.left + kRect.width / 2;
      const kCenterY = kRect.top + kRect.height / 2;
      const hCenterX = hRect.left + hRect.width / 2;
      const hCenterY = hRect.top + hRect.height / 2;
      // The key is 345x200 with its tip at the left (~40% of width left of key center).
      // Placing the tip into the keyhole means the key center should be ~0.40 * width to the right of the hole.
      const dx = Math.round((hCenterX - kCenterX) + (kRect.width * 0.40));
      const dy = Math.round(hCenterY - kCenterY);
      keyPos.style.setProperty("--fly-dx", `${dx}px`);
      keyPos.style.setProperty("--fly-dy", `${dy}px`);
    }

    if (openingHint) {
      openingHint.innerHTML = "<span>열쇠가 자물쇠를 향해 나아갑니다…</span><small>The golden key glides to the lock…</small>";
    }

    // Step 1: Key flies to the keyhole opening
    keyPos?.classList.add("is-flying");

    // Step 2: Key inserts into keyhole
    window.setTimeout(() => {
      keyPos?.classList.add("is-inserting");
      glow?.classList.add("is-active");
      if (openingHint) {
        openingHint.innerHTML = "<span>열쇠가 자물쇠에 들어맞습니다…</span><small>Inserting into the keyhole…</small>";
      }
    }, 620);

    // Step 3: Key turns 90 degrees
    window.setTimeout(() => {
      keyPos?.classList.add("is-turning");
      if (openingHint) {
        openingHint.innerHTML = "<span>황금 열쇠를 돌립니다…</span><small>Turning the golden key…</small>";
      }
    }, 1000);

    // Step 4: Padlock shackle pops open with radiant burst
    window.setTimeout(() => {
      lock?.classList.add("is-unlocked");
      flash?.classList.add("is-flashing");
      launchGateBurstParticles();
      if (openingHint) {
        openingHint.innerHTML = "<span>자물쇠가 열렸습니다 · 환영합니다 ♥</span><small>Unlocked · Welcome to our wedding</small>";
      }
    }, 1450);

    // Step 5: Smoothly reveal the invitation
    window.setTimeout(() => {
      isOpened = true;
      if (openingScreen) {
        openingScreen.classList.add("is-opened");
        window.setTimeout(() => {
          openingScreen.hidden = true;
        }, 900);
      }
      document.body.classList.remove("invitation-closed");
      window.scrollTo({ top: 0, behavior: "smooth" });
      launchCelebrationPetals();
    }, 2350);
  }

  keyBtn?.addEventListener("click", unlockAndOpen);
  keyBtn?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      unlockAndOpen();
    }
  });

  if (music instanceof HTMLAudioElement) {
    music.addEventListener("play", updateMusicUi);
    music.addEventListener("pause", updateMusicUi);
  }

  musicToggle?.addEventListener("click", () => {
    if (!(music instanceof HTMLAudioElement)) return;
    if (music.paused) {
      void startMusic();
    } else {
      music.pause();
      updateMusicUi();
    }
  });

  // Lightbox Gallery
  const lightbox = document.getElementById("korea-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const triggers = Array.from(document.querySelectorAll(".gallery-trigger"));
  let currentIndex = 0;

  function showSlide(index) {
    if (!triggers.length || !(lightboxImg instanceof HTMLImageElement)) return;
    currentIndex = (index + triggers.length) % triggers.length;
    const fig = triggers[currentIndex];
    const img = fig.querySelector("img");
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) {
      lightboxCaption.textContent =
        fig.getAttribute("data-caption") || `${currentIndex + 1} / ${triggers.length} · 김서연 & 이도윤`;
    }
  }

  triggers.forEach((fig, idx) => {
    fig.addEventListener("click", () => {
      if (!(lightbox instanceof HTMLDialogElement)) return;
      showSlide(idx);
      lightbox.showModal();
    });
  });

  document.getElementById("lightbox-close")?.addEventListener("click", () => {
    if (lightbox instanceof HTMLDialogElement) lightbox.close();
  });
  document.getElementById("lightbox-prev")?.addEventListener("click", () => showSlide(currentIndex - 1));
  document.getElementById("lightbox-next")?.addEventListener("click", () => showSlide(currentIndex + 1));

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox && lightbox instanceof HTMLDialogElement) {
      lightbox.close();
    }
  });

  // RSVP Form
  const rsvpForm = document.getElementById("korea-rsvp-form");
  const rsvpStatus = document.getElementById("korea-rsvp-status");
  rsvpForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!(rsvpForm instanceof HTMLFormElement) || !rsvpStatus) return;
    const data = new FormData(rsvpForm);
    const name = String(data.get("guestName") || "").trim();
    if (!name) return;
    rsvpStatus.textContent = `감사합니다, ${name}님! Seo-yeon & Do-yoon의 새로운 시작을 함께 축복해 주셔서 진심으로 감사드립니다 ♥ · Thank you for celebrating with us!`;
    rsvpForm.reset();
    launchCelebrationPetals();
  });

  updateMusicUi();
})();
