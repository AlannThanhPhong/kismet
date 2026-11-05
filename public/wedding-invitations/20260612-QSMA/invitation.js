const openingScreen = document.querySelector("#opening-screen");
const invitation = document.querySelector("#invitation");
const openButton = document.querySelector("#open-invitation");

openButton?.addEventListener("click", () => {
  if (!openingScreen || !invitation) return;
  openingScreen.classList.add("is-opening");
  window.setTimeout(() => {
    openingScreen.hidden = true;
    invitation.hidden = false;
    invitation.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420);
});

function escapeCalendarText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function saveDate() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const address = "Diamond Place, Sảnh Sapphire, tầng trệt, 15A Hồ Văn Huê, phường Đức Nhuận, TP. Hồ Chí Minh";
  const description = "Đón khách lúc 10:30; vào lúc 11:00; nhập tiệc lúc 11:30. Lễ Vu Quy tại tư gia nhà gái ở Hóc Môn lúc 08:00.";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kismet Love//Mai Anh Quang Son//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:20260612-QSMA@kismet.love",
    `DTSTAMP:${stamp}`,
    "DTSTART:20261206T040000Z",
    `SUMMARY:${escapeCalendarText("Tiệc Vu Quy Mai Anh & Quang Sơn")}`,
    `LOCATION:${escapeCalendarText(address)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeCalendarText("Ngày mai dự tiệc Vu Quy Mai Anh & Quang Sơn")}`,
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

document.querySelectorAll("[data-save-date]").forEach((button) => button.addEventListener("click", saveDate));
