const openingScreen = document.querySelector("#opening-screen");
const openingFountainLayer = document.querySelector("#opening-fountain-layer");
const invitation = document.querySelector("#invitation");
const openButton = document.querySelector("#open-invitation");
const openingCardTrigger = document.querySelector("#opening-card-trigger");
const introVideo = document.querySelector("#intro-video");
const introSoundBtn = document.querySelector("#intro-sound-btn");
const skipIntroBtn = document.querySelector("#skip-intro");
const weddingBgm = document.querySelector("#wedding-bgm");
const musicFab = document.querySelector("#music-fab");

let fountainShown = false;
let invitationRevealed = false;

function syncMusicUi() {
  if (!(weddingBgm instanceof HTMLAudioElement) || !(musicFab instanceof HTMLButtonElement)) return;
  const playing = !weddingBgm.paused;
  document.body.classList.toggle("music-playing", playing);
  musicFab.setAttribute("aria-pressed", String(playing));
  musicFab.setAttribute("aria-label", playing ? "Tạm dừng nhạc nền Lễ Đường" : "Bật nhạc nền Lễ Đường");
  const icon = musicFab.querySelector(".music-fab-icon");
  if (icon) icon.textContent = playing ? "❚❚" : "♫";
}

function tryPlayMusic() {
  if (!(weddingBgm instanceof HTMLAudioElement)) return;
  weddingBgm.volume = 0.72;
  void weddingBgm.play().then(syncMusicUi).catch(() => {});
}

/* Bước 2: Sau khi Intro tự chạy xong -> hiện Khung hình Đài Phun Nước + Khung Hoa Xanh + Nút Mở Thiệp */
function showFountainCover() {
  if (fountainShown || invitationRevealed || !openingScreen) return;
  fountainShown = true;

  if (introVideo instanceof HTMLVideoElement && !introVideo.paused) {
    introVideo.pause();
  }

  openingScreen.dataset.phase = "fountain";
  openingFountainLayer?.setAttribute("aria-hidden", "false");
}

/* Bước 3: Bấm nút Mở Thiệp trên màn hình Đài Phun Nước -> vào nội dung thiệp chính + bật nhạc nền */
function openMainInvitation() {
  if (invitationRevealed || !openingScreen || !invitation) return;
  invitationRevealed = true;

  if (introVideo instanceof HTMLVideoElement && !introVideo.paused) {
    introVideo.pause();
  }

  invitation.hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" });
  tryPlayMusic();

  openingScreen.classList.add("is-fading-out");
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 560;
  window.setTimeout(() => {
    openingScreen.hidden = true;
    invitation.focus({ preventScroll: true });
  }, delay);
}

/* Bước 1: Tự động chạy Intro 4K ngay khi vào trang */
function tryAutoplayIntro() {
  if (fountainShown || invitationRevealed || !(introVideo instanceof HTMLVideoElement)) return;
  introVideo.muted = true;
  const playPromise = introVideo.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

function handleManualIntroStart() {
  if (fountainShown || invitationRevealed || !(introVideo instanceof HTMLVideoElement)) return;
  if (!introVideo.paused) return;
  introVideo.muted = true;
  if (introSoundBtn instanceof HTMLButtonElement) {
    introSoundBtn.setAttribute("aria-pressed", "false");
    introSoundBtn.innerHTML = '<span aria-hidden="true">♫</span> Bật tiếng';
  }
  introVideo.play().catch(() => {
    introVideo.muted = true;
    if (introSoundBtn instanceof HTMLButtonElement) {
      introSoundBtn.setAttribute("aria-pressed", "false");
      introSoundBtn.innerHTML = '<span aria-hidden="true">♫</span> Bật tiếng';
    }
    introVideo.play().catch(showFountainCover);
  });
}

introVideo?.addEventListener("click", handleManualIntroStart);

introSoundBtn?.addEventListener("click", () => {
  if (!(introVideo instanceof HTMLVideoElement) || !(introSoundBtn instanceof HTMLButtonElement)) return;
  const nextUnmuted = introVideo.muted;
  introVideo.muted = !nextUnmuted;
  if (nextUnmuted) {
    introVideo.volume = 1;
    if (introVideo.paused) void introVideo.play().catch(() => {});
  }
  introSoundBtn.setAttribute("aria-pressed", String(nextUnmuted));
  introSoundBtn.innerHTML = nextUnmuted
    ? '<span aria-hidden="true">♫</span> Đang bật tiếng'
    : '<span aria-hidden="true">♫</span> Bật tiếng';
});

skipIntroBtn?.addEventListener("click", showFountainCover);
introVideo?.addEventListener("ended", showFountainCover);
introVideo?.addEventListener("error", () => {
  // Chỉ chuyển sang đài phun nước khi tất cả <source> đều lỗi
  if (introVideo instanceof HTMLVideoElement && introVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
    showFountainCover();
  }
});

openButton?.addEventListener("click", openMainInvitation);
openingCardTrigger?.addEventListener("click", openMainInvitation);
openingCardTrigger?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMainInvitation();
  }
});

musicFab?.addEventListener("click", () => {
  if (!(weddingBgm instanceof HTMLAudioElement)) return;
  if (weddingBgm.paused) {
    tryPlayMusic();
  } else {
    weddingBgm.pause();
    syncMusicUi();
  }
});

weddingBgm?.addEventListener("play", syncMusicUi);
weddingBgm?.addEventListener("pause", syncMusicUi);
syncMusicUi();

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("open") === "1" && openingScreen && invitation) {
  invitationRevealed = true;
  if (introVideo instanceof HTMLVideoElement) introVideo.pause();
  openingScreen.hidden = true;
  invitation.hidden = false;
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "instant" });
    }
  }
} else if (urlParams.get("phase") === "fountain") {
  showFountainCover();
} else {
  tryAutoplayIntro();
}

/* ==========================================================================
   SAVE TO CALENDAR (.ICS)
   ========================================================================== */
function escapeCalendarText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function saveDate() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const address = "Trung tâm Hội nghị Tiệc cưới Diamond Place, Sảnh Sapphire - Tầng trệt, 15A Hồ Văn Huê, Phường Đức Nhuận, TP. Hồ Chí Minh";
  const description = "Đón khách: 10h30 · Nhập tiệc: 11h00. Lễ Vu Quy của Trần Lê Mai Anh & Trần Quang Sơn (Chủ nhật 06.12.2026 - Nhằm ngày 28 tháng 10 năm Bính Ngọ).";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kismet Love//Mai Anh Quang Son//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:20260612-QSMA@kismet.love",
    `DTSTAMP:${stamp}`,
    "DTSTART:20261206T033000Z",
    "DTEND:20261206T070000Z",
    `SUMMARY:${escapeCalendarText("Tiệc Cưới Mai Anh & Quang Sơn")}`,
    `LOCATION:${escapeCalendarText(address)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeCalendarText("Ngày mai dự tiệc cưới Mai Anh & Quang Sơn tại Diamond Place")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const file = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const download = document.createElement("a");
  download.href = url;
  download.download = "Mai-Anh-Quang-Son-06-12-2026.ics";
  download.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

document.querySelectorAll("[data-save-date]").forEach((button) => {
  button.addEventListener("click", saveDate);
});

/* ==========================================================================
   COUNTDOWN TIMER TO 06.12.2026 11:00 (GMT+7)
   ========================================================================== */
const targetTimestamp = new Date("2026-12-06T11:00:00+07:00").getTime();
const countEls = {
  days: document.querySelector('[data-count="days"]'),
  hours: document.querySelector('[data-count="hours"]'),
  minutes: document.querySelector('[data-count="minutes"]'),
  seconds: document.querySelector('[data-count="seconds"]'),
};

function updateCountdown() {
  const diff = Math.max(0, targetTimestamp - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  if (countEls.days) countEls.days.textContent = String(days).padStart(2, "0");
  if (countEls.hours) countEls.hours.textContent = String(hours).padStart(2, "0");
  if (countEls.minutes) countEls.minutes.textContent = String(minutes).padStart(2, "0");
  if (countEls.seconds) countEls.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1_000);

/* ==========================================================================
   PHOTO LIGHTBOX
   ========================================================================== */
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrev = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");
const galleryTriggers = Array.from(document.querySelectorAll("[data-lightbox-src]"));
let currentPhotoIndex = 0;

function showPhotoAt(index) {
  if (!galleryTriggers.length || !(lightboxImg instanceof HTMLImageElement)) return;
  currentPhotoIndex = (index + galleryTriggers.length) % galleryTriggers.length;
  const item = galleryTriggers[currentPhotoIndex];
  const src = item.getAttribute("data-lightbox-src") || "";
  const caption = item.getAttribute("data-lightbox-caption") || "";
  const thumbAlt = item.querySelector("img")?.getAttribute("alt") || caption;
  lightboxImg.src = src;
  lightboxImg.alt = thumbAlt;
  if (lightboxCaption) lightboxCaption.textContent = caption;
}

galleryTriggers.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (!(lightbox instanceof HTMLDialogElement)) return;
    showPhotoAt(index);
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener("click", () => {
  if (lightbox instanceof HTMLDialogElement) lightbox.close();
});

lightboxPrev?.addEventListener("click", () => showPhotoAt(currentPhotoIndex - 1));
lightboxNext?.addEventListener("click", () => showPhotoAt(currentPhotoIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox && lightbox instanceof HTMLDialogElement) {
    lightbox.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (!(lightbox instanceof HTMLDialogElement) || !lightbox.open) return;
  if (event.key === "ArrowLeft") showPhotoAt(currentPhotoIndex - 1);
  if (event.key === "ArrowRight") showPhotoAt(currentPhotoIndex + 1);
});

/* ==========================================================================
   RSVP FORM SUBMISSION (/api/invitations/20260612-QSMA/rsvps)
   ========================================================================== */
const rsvpForm = document.querySelector("#rsvp-form");
const rsvpStatus = document.querySelector("#rsvp-status");
const guestCountInput = document.querySelector("#guest-count");
const TOKEN_STORAGE_KEY = "kismet-rsvp-token-20260612-QSMA";

function getOrCreateResponseToken() {
  try {
    const existing = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (existing && /^[a-f0-9-]{36}$/i.test(existing)) return existing;
    const generated = window.crypto?.randomUUID?.();
    if (generated) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, generated);
      return generated;
    }
  } catch {
    // Ignore storage access errors in private browsing
  }
  return undefined;
}

document.querySelectorAll('input[name="attending"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!(guestCountInput instanceof HTMLInputElement)) return;
    const attendingYes = document.querySelector('input[name="attending"]:checked')?.value === "yes";
    guestCountInput.disabled = !attendingYes;
  });
});

rsvpForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!(rsvpForm instanceof HTMLFormElement) || !(rsvpStatus instanceof HTMLElement)) return;

  const formData = new FormData(rsvpForm);
  const guestName = String(formData.get("guestName") || "").trim();
  const attending = formData.get("attending") === "yes";
  const rawCount = Number.parseInt(String(formData.get("guestCount") || "1"), 10);
  const guestCount = Number.isInteger(rawCount) ? Math.min(20, Math.max(1, rawCount)) : 1;
  const message = String(formData.get("message") || "").trim();

  if (!guestName) {
    document.querySelector("#guest-name")?.focus();
    rsvpStatus.textContent = "Quý khách vui lòng nhập tên trước khi gửi nhé.";
    rsvpStatus.dataset.error = "true";
    return;
  }

  const submitBtn = rsvpForm.querySelector('button[type="submit"]');
  if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;
  delete rsvpStatus.dataset.error;
  rsvpStatus.textContent = "Đang gửi xác nhận & lời chúc…";

  try {
    const responseToken = getOrCreateResponseToken();
    const response = await fetch("/api/invitations/20260612-QSMA/rsvps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        guestName,
        attending,
        guestCount: attending ? guestCount : 1,
        ...(message ? { message } : {}),
        ...(responseToken ? { responseToken } : {}),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || "Chưa thể lưu xác nhận lúc này. Quý khách vui lòng thử lại nhé.");
    }
    rsvpStatus.textContent = result.updated
      ? "Đã cập nhật xác nhận & lời chúc của quý khách. Trân trọng cảm ơn! ♡"
      : "Cảm ơn quý khách đã gửi xác nhận & lời chúc đến Mai Anh và Quang Sơn! ♡";
  } catch (error) {
    rsvpStatus.dataset.error = "true";
    rsvpStatus.textContent =
      error instanceof Error && error.name === "TimeoutError"
        ? "Kết nối hơi chậm, quý khách vui lòng thử gửi lại nhé."
        : error instanceof Error
          ? error.message
          : "Chưa thể lưu xác nhận lúc này. Quý khách vui lòng thử lại nhé.";
  } finally {
    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
  }
});
