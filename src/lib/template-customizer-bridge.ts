export interface ExactTemplateConfig {
  code: string;
  name: string;
  coupleName: string;
  badge: string;
  iframeSrc: string;
  defaultMusicSrc: string;
  defaultMusicTitle: string;
}

export const EXACT_TEMPLATES: ExactTemplateConfig[] = [
  {
    code: "lovers-diary",
    name: "LOVER’S DIARY",
    coupleName: "Élodie Laurent & Gabriel Moreau",
    badge: "TEMPLATE N° 01 · PARIS",
    iframeSrc: "/wedding-invitations/Lover%E2%80%99s%20Diary/index.html",
    defaultMusicSrc: "/music/wedding/city-of-stars-may-finally-come-true.mp3",
    defaultMusicTitle: "City Of Stars — May Finally Come True (From La La Land Score)",
  },
  {
    code: "french-style",
    name: "FRENCH STYLE",
    coupleName: "Élise Beaumont & Julien Laurent",
    badge: "TEMPLATE N° 02 · CHÂTEAU PARIS",
    iframeSrc: "/wedding-invitations/French%20Style/index.html",
    defaultMusicSrc: "/music/wedding/city-of-stars-may-finally-come-true.mp3",
    defaultMusicTitle: "French Salon Instrumental",
  },
];

export function getExactTemplateByCode(rawCode?: string | null): ExactTemplateConfig {
  if (!rawCode) return EXACT_TEMPLATES[0];
  const decoded = decodeURIComponent(rawCode).trim();
  const normalized =
    decoded === "Lover’s Diary" || decoded === "Lover's Diary" || decoded === "lovers-diary"
      ? "lovers-diary"
      : decoded === "French Style" || decoded === "french-style"
        ? "french-style"
        : decoded;
  return EXACT_TEMPLATES.find((t) => t.code === normalized) || EXACT_TEMPLATES[0];
}

export interface TemplateImageSlot {
  id: string;
  origSrc: string;
  currentSrc: string;
  label: string;
  count: number;
}

export interface TemplateTextSlot {
  id: string;
  origText: string;
  currentText: string;
  label: string;
  tagName: string;
  multiline: boolean;
}

interface BoundTextNodeRecord {
  id: string;
  node: Text;
  parent: HTMLElement;
  origText: string;
  leadingSpace: string;
  trailingSpace: string;
  label: string;
  tagName: string;
}

interface KismetAugmentedDocument extends Document {
  __kismetBound?: boolean;
  __kismetTextRecords?: BoundTextNodeRecord[];
  __kismetImageElements?: Map<string, HTMLImageElement[]>;
}

function normalizeRelSrc(rawSrc: string): string {
  if (!rawSrc) return "";
  try {
    const u = new URL(rawSrc, "http://localhost");
    return decodeURIComponent(u.pathname);
  } catch {
    return rawSrc;
  }
}

/**
 * Scans the iframe Document once (or re-scans if new elements mounted) and indexes
 * all replaceable images and editable text nodes without mutating layout or structure.
 */
export function inspectTemplateDom(doc: Document): {
  images: TemplateImageSlot[];
  texts: TemplateTextSlot[];
} {
  const kDoc = doc as KismetAugmentedDocument;

  // 1. Index Images (grouped by unique original image source so duplicates like cover + collage or lightbox stay in sync,
  //    while still allowing individual slot replacement)
  const imgElements = Array.from(doc.querySelectorAll<HTMLImageElement>("img")).filter((img) => {
    // Skip lightbox preview placeholder image and decorative background art (e.g. French curtain)
    if (
      img.id === "diary-lightbox-img" ||
      img.closest("dialog") ||
      img.classList.contains("curtain-real-img") ||
      img.hasAttribute("data-kismet-skip")
    ) {
      return false;
    }
    const src = img.getAttribute("src") || "";
    if (src.startsWith("data:image/svg")) return false;
    return true;
  });

  const imageSlotMap = new Map<string, TemplateImageSlot>();
  const imageElemMap = new Map<string, HTMLImageElement[]>();

  imgElements.forEach((img, index) => {
    let slotId = img.getAttribute("data-kismet-img-id");
    let origSrc = img.getAttribute("data-kismet-orig-src");
    if (!origSrc) {
      origSrc = img.getAttribute("src") || img.src || `img-${index}`;
      img.setAttribute("data-kismet-orig-src", origSrc);
    }
    if (!slotId) {
      slotId = `img-${index}`;
      img.setAttribute("data-kismet-img-id", slotId);
    }

    const figcaption = img.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
    const altText = img.getAttribute("alt")?.trim();
    const rawLabel = figcaption || altText || `Ảnh #${index + 1}`;
    const label = `Ảnh #${index + 1} · ${rawLabel.slice(0, 48)}`;

    imageSlotMap.set(slotId, {
      id: slotId,
      origSrc,
      currentSrc: img.src,
      label,
      count: 1,
    });
    imageElemMap.set(slotId, [img]);
  });

  kDoc.__kismetImageElements = imageElemMap;

  // 2. Index Editable Text Nodes
  if (!kDoc.__kismetTextRecords || kDoc.__kismetTextRecords.length === 0) {
    const records: BoundTextNodeRecord[] = [];
    const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "DEFS", "TITLE", "HEAD", "META", "LINK", "DIALOG"]);

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest("svg, script, style, noscript, dialog, #kismet-end-of-invitation-cta")) return NodeFilter.FILTER_REJECT;
        const text = node.nodeValue || "";
        const trimmed = text.trim();
        if (!trimmed) return NodeFilter.FILTER_REJECT;
        // Skip single-character decorative symbols like × or •
        if (trimmed.length <= 1 && /^[^a-zA-Z0-9À-ỹ]+$/.test(trimmed)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let currentNode = walker.nextNode();
    let txtIndex = 0;
    while (currentNode) {
      const textNode = currentNode as Text;
      const parent = textNode.parentElement!;
      const raw = textNode.nodeValue || "";
      const leadingMatch = raw.match(/^\s*/);
      const trailingMatch = raw.match(/\s*$/);
      const leadingSpace = leadingMatch ? leadingMatch[0] : "";
      const trailingSpace = trailingMatch ? trailingMatch[0] : "";
      const origText = raw.trim();

      const id = `txt-${txtIndex}`;
      parent.setAttribute("data-kismet-txt-id", id);

      const tag = parent.tagName.toLowerCase();
      let typeHint = "Văn bản";
      if (tag === "h1" || tag === "h2" || tag === "h3") typeHint = "Tiêu đề";
      else if (tag === "figcaption") typeHint = "Chú thích ảnh";
      else if (tag === "button" || tag === "a") typeHint = "Nút / Liên kết";
      else if (tag === "label" || tag === "legend") typeHint = "Nhãn form";

      records.push({
        id,
        node: textNode,
        parent,
        origText,
        leadingSpace,
        trailingSpace,
        label: `${typeHint} #${txtIndex + 1}`,
        tagName: tag,
      });

      txtIndex += 1;
      currentNode = walker.nextNode();
    }

    kDoc.__kismetTextRecords = records;
  }

  const texts: TemplateTextSlot[] = (kDoc.__kismetTextRecords || []).map((rec) => {
    const currentText = (rec.node.nodeValue || "").trim();
    return {
      id: rec.id,
      origText: rec.origText,
      currentText,
      label: rec.label,
      tagName: rec.tagName,
      multiline: rec.origText.length > 55 || rec.tagName === "p" || rec.tagName === "blockquote",
    };
  });

  return {
    images: Array.from(imageSlotMap.values()),
    texts,
  };
}

/**
 * Applies image overrides, text overrides, and background music overrides directly
 * onto the template iframe's Document while keeping 100% of the original layout & styles.
 */
export function applyCustomizationsToDoc(
  doc: Document,
  overrides: {
    imageMap?: Record<string, string>;
    textMap?: Record<string, string>;
    musicSrc?: string;
    musicTitle?: string;
  },
) {
  const { images } = inspectTemplateDom(doc);
  const kDoc = doc as KismetAugmentedDocument;
  const imageMap = overrides.imageMap || {};
  const textMap = overrides.textMap || {};

  // Build a lookup from normalized original relative path -> new image URL
  // so lightbox attributes and CSS background images using the same photo also update
  const relPathOverrides = new Map<string, string>();

  images.forEach((slot) => {
    const newSrc = imageMap[slot.id] || imageMap[slot.origSrc] || slot.origSrc;
    const elems = kDoc.__kismetImageElements?.get(slot.id) || [];
    if (imageMap[slot.id] || imageMap[slot.origSrc]) {
      relPathOverrides.set(normalizeRelSrc(slot.origSrc), newSrc);
      relPathOverrides.set(slot.origSrc, newSrc);
    }

    elems.forEach((img) => {
      if (img.getAttribute("src") !== newSrc) {
        img.src = newSrc;
      }
      if (imageMap[slot.id] || imageMap[slot.origSrc]) {
        img.removeAttribute("srcset");
        const picture = img.parentElement;
        if (picture && picture.tagName === "PICTURE") {
          picture.querySelectorAll("source").forEach((s) => s.removeAttribute("srcset"));
        }
        const lightboxHolder = img.closest("[data-lightbox-src]");
        if (lightboxHolder) {
          lightboxHolder.setAttribute("data-lightbox-src", newSrc);
        }
      }
    });
  });

  // If Lover's Diary backdrop image was replaced, also update .cover-gate-backdrop and .red-tape-backdrop
  let customBgStyle = doc.getElementById("kismet-custom-bg-style") as HTMLStyleElement | null;
  const bgRules: string[] = [];
  relPathOverrides.forEach((newUrl, origKey) => {
    if (origKey.includes("18-13-29 (2)") || origKey.includes("18-13-29%20(2)")) {
      bgRules.push(
        `.red-tape-backdrop { background-image: url("${newUrl}") !important; }`,
        `.cover-gate-backdrop { background-image: radial-gradient(circle at center, rgba(28, 22, 19, 0.42) 0%, rgba(16, 12, 10, 0.82) 100%), url("${newUrl}") !important; }`,
      );
    }
  });
  if (bgRules.length > 0) {
    if (!customBgStyle) {
      customBgStyle = doc.createElement("style");
      customBgStyle.id = "kismet-custom-bg-style";
      doc.head.appendChild(customBgStyle);
    }
    customBgStyle.textContent = bgRules.join("\n");
  } else if (customBgStyle) {
    customBgStyle.textContent = "";
  }

  // Apply Text Overrides
  const textRecords = kDoc.__kismetTextRecords || [];
  textRecords.forEach((rec) => {
    const desired = textMap[rec.id] !== undefined ? textMap[rec.id] : rec.origText;
    const nextValue = `${rec.leadingSpace}${desired}${rec.trailingSpace}`;
    if (rec.node.nodeValue !== nextValue) {
      rec.node.nodeValue = nextValue;
    }
  });

  // Apply Music Override
  if (overrides.musicSrc) {
    let audio = doc.querySelector<HTMLAudioElement>(
      "#diary-bgm, #wedding-audio, #wedding-song, #wedding-music, audio",
    );
    if (!audio) {
      audio = doc.createElement("audio");
      audio.id = "kismet-injected-bgm";
      audio.loop = true;
      audio.preload = "auto";
      doc.body.appendChild(audio);
    }

    const currentAttrSrc = audio.getAttribute("src") || "";
    if (currentAttrSrc !== overrides.musicSrc) {
      const wasPlaying = !audio.paused;
      audio.src = overrides.musicSrc;
      audio.querySelectorAll("source").forEach((s) => {
        s.src = overrides.musicSrc!;
      });
      audio.load();
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    }

    if (overrides.musicTitle) {
      audio.setAttribute("data-song-title", overrides.musicTitle);
      const coverSmall = doc.querySelector(".cover-open-text small");
      if (coverSmall && textMap[coverSmall.getAttribute("data-kismet-txt-id") || ""] === undefined) {
        coverSmall.textContent = `♪ ${overrides.musicTitle}`;
      }
      const diaryAudioLabel = doc.getElementById("diary-audio-label");
      if (diaryAudioLabel) {
        const isPlaying = !audio.paused;
        diaryAudioLabel.textContent = `♪ ${overrides.musicTitle} · ${isPlaying ? "On" : "Off"}`;
      }
    }
  }
}

/**
 * Allows the Studio Editor to toggle the opening cover gate (Envelope / Diary Cover / Typewriter)
 * on or off so the user can easily inspect & edit both the opening cover and the main content inside.
 */
export function setTemplateCoverGateVisibility(doc: Document, showCoverGate: boolean) {
  let helperStyle = doc.getElementById("kismet-gate-toggle-style") as HTMLStyleElement | null;
  if (!helperStyle) {
    helperStyle = doc.createElement("style");
    helperStyle.id = "kismet-gate-toggle-style";
    doc.head.appendChild(helperStyle);
  }

  if (!showCoverGate) {
    // Bypass cover gate so inside content is immediately visible and scrollable
    helperStyle.textContent = `
      body.is-locked, body.is-sealed, body.intro-locked {
        overflow: auto !important;
        height: auto !important;
      }
      body.is-locked .diary-main,
      body.is-locked .french-parchment-sheet,
      .invitation-shell.is-hidden {
        opacity: 1 !important;
        transform: none !important;
        pointer-events: auto !important;
        display: block !important;
      }
      #diary-cover-gate,
      #french-cover-gate,
      .typewriter-intro-overlay,
      #typewriter-intro {
        display: none !important;
      }
    `;
  } else {
    helperStyle.textContent = "";
    const diaryGate = doc.getElementById("diary-cover-gate") || doc.getElementById("french-cover-gate");
    if (diaryGate) {
      diaryGate.classList.remove("is-opening", "is-opened");
      doc.body.classList.add("is-locked");
    }
  }
}

/**
 * Installs interactive click-to-edit listeners inside the template iframe when in Studio Edit mode.
 * Clicking an image triggers onSelectImage(slotId); clicking a text triggers onSelectText(slotId).
 */
export function installInteractiveHighlightBridge(
  doc: Document,
  callbacks: {
    onSelectImage: (slotId: string) => void;
    onSelectText: (slotId: string) => void;
  },
) {
  const kDoc = doc as KismetAugmentedDocument;
  if (kDoc.__kismetBound) return;
  kDoc.__kismetBound = true;

  const style = doc.createElement("style");
  style.id = "kismet-interactive-editor-style";
  style.textContent = `
    [data-kismet-img-id] {
      transition: outline 0.15s ease, outline-offset 0.15s ease;
    }
    body.kismet-direct-edit [data-kismet-img-id]:hover {
      outline: 3px dashed #c81912 !important;
      outline-offset: 2px !important;
      cursor: pointer !important;
    }
    body.kismet-direct-edit [data-kismet-txt-id]:hover {
      outline: 2px dashed rgba(123, 35, 31, 0.75) !important;
      outline-offset: 2px !important;
      cursor: text !important;
      background-color: rgba(240, 215, 140, 0.16);
    }
    .kismet-active-target {
      outline: 3px solid #c81912 !important;
      outline-offset: 3px !important;
    }
  `;
  doc.head.appendChild(style);
  doc.body.classList.add("kismet-direct-edit");

  doc.addEventListener(
    "click",
    (e) => {
      if (!doc.body.classList.contains("kismet-direct-edit")) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const img = target.closest<HTMLElement>("[data-kismet-img-id]");
      if (img) {
        e.preventDefault();
        e.stopPropagation();
        const slotId = img.getAttribute("data-kismet-img-id");
        if (slotId) callbacks.onSelectImage(slotId);
        return;
      }

      const txt = target.closest<HTMLElement>("[data-kismet-txt-id]");
      if (txt) {
        const slotId = txt.getAttribute("data-kismet-txt-id");
        if (slotId) {
          callbacks.onSelectText(slotId);
        }
      }
    },
    true,
  );
}

/**
 * Compresses an uploaded image file on the client using an HTMLCanvasElement so it can be
 * stored and shared via the published trial API without hitting payload limits.
 */
export function compressImageFile(file: File, maxDim = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc file ảnh"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(String(reader.result));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function readAudioFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc file nhạc"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
