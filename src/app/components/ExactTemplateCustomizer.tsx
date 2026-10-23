"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  ExternalLink,
  Eye,
  ImageIcon,
  LockOpen,
  Mail,
  Monitor,
  Music,
  RefreshCw,
  Search,
  Smartphone,
  Sparkles,
  Type,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { WEDDING_SONGS } from "@/lib/wedding-songs";
import {
  EXACT_TEMPLATES,
  applyCustomizationsToDoc,
  compressImageFile,
  getExactTemplateByCode,
  installInteractiveHighlightBridge,
  inspectTemplateDom,
  loadTrialFromIndexedDb,
  readAudioFileAsDataUrl,
  saveTrialToIndexedDb,
  setTemplateCoverGateVisibility,
  type TemplateImageSlot,
  type TemplateTextSlot,
} from "@/lib/template-customizer-bridge";
import type { PublishedTrialPayload } from "@/lib/published-trials-store";

interface ExactTemplateCustomizerProps {
  initialTemplateCode?: string | null;
  initialCustomId?: string | null;
  onSwitchToClassicBuilder?: () => void;
}

export default function ExactTemplateCustomizer({
  initialTemplateCode,
  initialCustomId,
  onSwitchToClassicBuilder,
}: ExactTemplateCustomizerProps) {
  const initialTemplate = useMemo(
    () => getExactTemplateByCode(initialTemplateCode),
    [initialTemplateCode],
  );

  const [selectedCode, setSelectedCode] = useState<string>(initialTemplate.code);
  const currentTemplate = useMemo(
    () => getExactTemplateByCode(selectedCode),
    [selectedCode],
  );

  const [sidebarTab, setSidebarTab] = useState<"images" | "texts" | "music">("images");
  const [mobilePane, setMobilePane] = useState<"editor" | "preview">("editor");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [showCoverGate, setShowCoverGate] = useState<boolean>(false);

  // Discovered slots from the live template DOM
  const [imageSlots, setImageSlots] = useState<TemplateImageSlot[]>([]);
  const [textSlots, setTextSlots] = useState<TemplateTextSlot[]>([]);

  // User customizations for the currently selected template
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [textMap, setTextMap] = useState<Record<string, string>>({});
  const [musicSrc, setMusicSrc] = useState<string>(initialTemplate.defaultMusicSrc);
  const [musicTitle, setMusicTitle] = useState<string>(initialTemplate.defaultMusicTitle);

  // Active highlight / search
  const [activeImageSlotId, setActiveImageSlotId] = useState<string | null>(null);
  const [activeTextSlotId, setActiveTextSlotId] = useState<string | null>(null);
  const [textSearch, setTextSearch] = useState<string>("");

  // Publishing state
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(initialCustomId || null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Audio preview in sidebar
  const [isPlayingPreviewAudio, setIsPlayingPreviewAudio] = useState<boolean>(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Hidden file input for quick click-on-iframe image replacement
  const quickFileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingImageSlotRef = useRef<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const showToast = useCallback((msg: string) => {
    setStatusToast(msg);
    window.setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3400);
  }, []);

  // Load saved draft from IndexedDB / localStorage or server when switching template
  useEffect(() => {
    let cancelled = false;
    const tpl = getExactTemplateByCode(selectedCode);
    setMusicSrc(tpl.defaultMusicSrc);
    setMusicTitle(tpl.defaultMusicTitle);
    setImageMap({});
    setTextMap({});
    setPublishedUrl(null);

    const draftKey = `kismet-exact-draft-${tpl.code}`;

    async function hydrateDraft() {
      // 1. Try IndexedDB first (holds full multi-image drafts that exceed localStorage 5MB)
      const idbDraft = await loadTrialFromIndexedDb<Partial<PublishedTrialPayload>>(draftKey);
      if (!cancelled && idbDraft) {
        if (idbDraft.imageMap) setImageMap(idbDraft.imageMap);
        if (idbDraft.textMap) setTextMap(idbDraft.textMap);
        if (idbDraft.musicSrc) setMusicSrc(idbDraft.musicSrc);
        if (idbDraft.musicTitle) setMusicTitle(idbDraft.musicTitle);
      } else {
        // 2. Fallback to localStorage
        try {
          const saved = localStorage.getItem(draftKey);
          if (!cancelled && saved) {
            const parsed = JSON.parse(saved) as Partial<PublishedTrialPayload>;
            if (parsed.imageMap) setImageMap(parsed.imageMap);
            if (parsed.textMap) setTextMap(parsed.textMap);
            if (parsed.musicSrc) setMusicSrc(parsed.musicSrc);
            if (parsed.musicTitle) setMusicTitle(parsed.musicTitle);
          }
        } catch {
          // Ignore storage error
        }
      }

      // 3. If opened with ?custom=ID, load that published trial
      if (initialCustomId && tpl.code === initialTemplate.code) {
        const idbCustom = await loadTrialFromIndexedDb<PublishedTrialPayload>(
          `kismet-published-trial-${initialCustomId}`,
        );
        if (!cancelled && idbCustom && idbCustom.templateCode === tpl.code) {
          setImageMap(idbCustom.imageMap || {});
          setTextMap(idbCustom.textMap || {});
          if (idbCustom.musicSrc) setMusicSrc(idbCustom.musicSrc);
          if (idbCustom.musicTitle) setMusicTitle(idbCustom.musicTitle);
        }

        try {
          const r = await fetch(`/api/published-trials/${encodeURIComponent(initialCustomId)}`, {
            cache: "no-store",
          });
          if (r.ok) {
            const json = (await r.json()) as { record?: PublishedTrialPayload } | null;
            if (!cancelled && json?.record && json.record.templateCode === tpl.code) {
              setImageMap(json.record.imageMap || {});
              setTextMap(json.record.textMap || {});
              if (json.record.musicSrc) setMusicSrc(json.record.musicSrc);
              if (json.record.musicTitle) setMusicTitle(json.record.musicTitle);
            }
          }
        } catch {
          // Ignore offline fetch
        }
      }
    }

    void hydrateDraft();
    return () => {
      cancelled = true;
    };
  }, [selectedCode, initialCustomId, initialTemplate.code]);

  // Save draft to IndexedDB & localStorage automatically whenever edits change
  useEffect(() => {
    const draftKey = `kismet-exact-draft-${currentTemplate.code}`;
    const draftPayload = {
      templateCode: currentTemplate.code,
      imageMap,
      textMap,
      musicSrc,
      musicTitle,
    };

    void saveTrialToIndexedDb(draftKey, draftPayload);

    try {
      localStorage.setItem(draftKey, JSON.stringify(draftPayload));
    } catch {
      // If localStorage hits 5MB quota due to many photos, save lightweight text+music draft
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            templateCode: currentTemplate.code,
            imageMap: {},
            textMap,
            musicSrc: musicSrc.startsWith("data:") ? currentTemplate.defaultMusicSrc : musicSrc,
            musicTitle,
          }),
        );
      } catch {
        // Ignore quota errors
      }
    }
  }, [currentTemplate.code, currentTemplate.defaultMusicSrc, imageMap, textMap, musicSrc, musicTitle]);

  // Sync customizations and inspect slots on the live iframe
  const syncIframeDom = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.body) return;

    const inspected = inspectTemplateDom(doc);
    setImageSlots(inspected.images);
    setTextSlots(inspected.texts);

    applyCustomizationsToDoc(doc, {
      imageMap,
      textMap,
      musicSrc,
      musicTitle,
    });

    setTemplateCoverGateVisibility(doc, showCoverGate);

    installInteractiveHighlightBridge(doc, {
      onSelectImage: (slotId) => {
        setSidebarTab("images");
        setActiveImageSlotId(slotId);
        pendingImageSlotRef.current = slotId;
        quickFileInputRef.current?.click();
      },
      onSelectText: (slotId) => {
        setSidebarTab("texts");
        setMobilePane("editor");
        setActiveTextSlotId(slotId);
        window.setTimeout(() => {
          const el = document.getElementById(`editor-txt-field-${slotId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
              el.focus();
            }
          }
        }, 80);
      },
    });
  }, [imageMap, textMap, musicSrc, musicTitle, showCoverGate]);

  useEffect(() => {
    syncIframeDom();
  }, [syncIframeDom]);

  // Replace a specific image slot with an uploaded file
  const handleReplaceImageFile = async (slotId: string, file?: File | null) => {
    if (!file) return;
    try {
      showToast("Đang nén & thay ảnh vào thiệp…");
      const compressedDataUrl = await compressImageFile(file, 1080, 0.76);
      setImageMap((prev) => ({
        ...prev,
        [slotId]: compressedDataUrl,
      }));
      showToast("Đã thay ảnh thành công!");
    } catch {
      showToast("Không thể đọc file ảnh này, vui lòng thử ảnh khác.");
    }
  };

  const handleResetSingleImage = (slotId: string) => {
    setImageMap((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const handleChangeText = (slotId: string, value: string) => {
    setTextMap((prev) => ({
      ...prev,
      [slotId]: value,
    }));
  };

  const handleResetSingleText = (slotId: string) => {
    setTextMap((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const handleResetAllChanges = () => {
    setImageMap({});
    setTextMap({});
    setMusicSrc(currentTemplate.defaultMusicSrc);
    setMusicTitle(currentTemplate.defaultMusicTitle);
    const draftKey = `kismet-exact-draft-${currentTemplate.code}`;
    void saveTrialToIndexedDb(draftKey, null);
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Ignore
    }
    showToast("Đã khôi phục toàn bộ ảnh, nội dung và nhạc về mặc định của mẫu.");
  };

  // Upload custom MP3 / M4A song file
  const handleUploadCustomMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast("Đang nạp file nhạc của bạn…");
      const dataUrl = await readAudioFileAsDataUrl(file);
      const cleanName = file.name.replace(/\.[a-zA-Z0-9]+$/, "");
      setMusicSrc(dataUrl);
      setMusicTitle(cleanName);
      showToast(`Đã đổi nhạc nền thành: ${cleanName}`);
    } catch {
      showToast("Không thể nạp file nhạc này.");
    }
  };

  // Publish & open live shareable trial invitation
  const handlePublishTrial = async () => {
    setIsPublishing(true);
    try {
      const clientTrialId =
        publishedId && /^[a-zA-Z0-9_-]{4,40}$/.test(publishedId)
          ? publishedId
          : `trial-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

      const record: PublishedTrialPayload = {
        id: clientTrialId,
        templateCode: currentTemplate.code,
        title: `${currentTemplate.name} — Bản thiết kế xem thử`,
        imageMap,
        textMap,
        musicSrc,
        musicTitle,
        createdAt: new Date().toISOString(),
      };

      // 1. Always persist immediately to IndexedDB (unlimited quota) & localStorage (if fits)
      await saveTrialToIndexedDb(`kismet-published-trial-${clientTrialId}`, record);
      try {
        localStorage.setItem(`kismet-published-trial-${clientTrialId}`, JSON.stringify(record));
      } catch {
        // Ignore 5MB localStorage quota error since IndexedDB + server API store it
      }

      let finalId = clientTrialId;
      let finalShareUrl = `/thiep/${encodeURIComponent(currentTemplate.code)}?custom=${encodeURIComponent(clientTrialId)}`;

      // 2. Sync to server API (/api/published-trials)
      try {
        let res = await fetch("/api/published-trials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });

        // If custom uploaded audio made the payload too large, retry with preset music URL
        if (!res.ok && musicSrc.startsWith("data:")) {
          res = await fetch("/api/published-trials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...record,
              musicSrc: currentTemplate.defaultMusicSrc,
            }),
          });
        }

        if (res.ok) {
          const json = (await res.json()) as {
            id?: string;
            shareUrl?: string;
          };
          if (json.id) finalId = json.id;
          if (json.shareUrl) finalShareUrl = json.shareUrl;
        }
      } catch {
        // Even if server API is unreachable, IndexedDB + localStorage have the record ready for this device
      }

      setPublishedId(finalId);
      setPublishedUrl(finalShareUrl);
      await saveTrialToIndexedDb(`kismet-published-trial-${finalId}`, { ...record, id: finalId });

      // Try opening in a new tab; on mobile browsers where popup blockers block async window.open,
      // show a clear toast and banner with a direct tap link
      const popup = window.open(finalShareUrl, "_blank");
      if (!popup) {
        showToast("Đã xuất bản thành công! Bấm nút 'Mở xem thiệp vừa xuất bản ↗' bên dưới.");
      } else {
        showToast("Đã xuất bản thiệp xem thử thành công!");
      }
    } catch {
      showToast("Có lỗi khi xuất bản, vui lòng thử lại.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyPublishedLink = () => {
    if (!publishedUrl) return;
    const fullUrl = `${window.location.origin}${publishedUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  const filteredTextSlots = useMemo(() => {
    const q = textSearch.trim().toLowerCase();
    if (!q) return textSlots;
    return textSlots.filter(
      (slot) =>
        slot.currentText.toLowerCase().includes(q) ||
        slot.origText.toLowerCase().includes(q) ||
        slot.label.toLowerCase().includes(q),
    );
  }, [textSlots, textSearch]);

  const modifiedImageCount = Object.keys(imageMap).length;
  const modifiedTextCount = Object.keys(textMap).length;

  return (
    <div className="kismet-studio-shell">
      <style>{`
        .kismet-studio-shell {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          width: 100%;
          max-width: 100vw;
          background: #f4f1ea;
          color: #1e1b18;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
          box-sizing: border-box;
        }
        .kismet-studio-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 16px;
          background: #1c1917;
          color: #fbf9f4;
          border-bottom: 1px solid rgba(240, 215, 140, 0.22);
          flex-wrap: wrap;
          z-index: 30;
          box-sizing: border-box;
          max-width: 100vw;
        }
        .kismet-studio-header-left,
        .kismet-studio-header-center,
        .kismet-studio-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }
        .kismet-template-select-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          max-width: 100%;
        }
        .kismet-template-select {
          padding: 7px 10px;
          border-radius: 8px;
          border: 1px solid rgba(240, 215, 140, 0.45);
          background: #2b2522;
          color: #f8e7be;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          max-width: min(320px, calc(100vw - 110px));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .kismet-studio-workspace {
          display: grid;
          grid-template-columns: minmax(340px, 415px) 1fr;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }
        .kismet-studio-aside {
          display: flex;
          flex-direction: column;
          background: #fbf9f4;
          border-right: 1px solid rgba(30, 27, 24, 0.12);
          min-height: 0;
          overflow: hidden;
        }
        .kismet-studio-main {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #e5dfd3;
          overflow: hidden;
          min-height: 0;
        }
        .kismet-mobile-mode-switcher {
          display: none;
        }
        .kismet-mobile-floating-toggle {
          display: none;
        }

        @media (max-width: 900px) {
          .kismet-studio-header {
            padding: 8px 10px;
            gap: 6px;
          }
          .kismet-hide-on-mobile {
            display: none !important;
          }
          .kismet-template-select {
            font-size: 12px;
            padding: 6px 8px;
            max-width: calc(100vw - 135px);
          }
          .kismet-studio-workspace {
            display: flex;
            flex-direction: column;
          }
          .kismet-studio-aside {
            width: 100%;
            flex: 1;
            border-right: 0;
          }
          .kismet-studio-aside.is-mobile-hidden {
            display: none !important;
          }
          .kismet-studio-main {
            width: 100%;
            flex: 1;
            padding: 0 !important;
          }
          .kismet-studio-main.is-mobile-hidden {
            display: none !important;
          }
          .kismet-studio-main-frame {
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
          }
          .kismet-mobile-mode-switcher {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            padding: 6px 10px;
            background: #27221f;
            border-bottom: 1px solid rgba(240, 215, 140, 0.2);
          }
          .kismet-mobile-floating-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            position: fixed;
            bottom: 16px;
            right: 16px;
            z-index: 75;
            padding: 11px 18px;
            border-radius: 999px;
            border: 1px solid #f0d78c;
            background: #1c1917;
            color: #f8e7be;
            font-size: 13px;
            font-weight: 700;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
            cursor: pointer;
          }
        }
      `}</style>

      {/* Hidden file input triggered when clicking any image directly inside the live iframe */}
      <input
        ref={quickFileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          const slotId = pendingImageSlotRef.current;
          if (file && slotId) {
            void handleReplaceImageFile(slotId, file);
          }
          e.target.value = "";
        }}
      />

      {/* Hidden audio element for previewing songs in the sidebar */}
      <audio
        ref={previewAudioRef}
        src={musicSrc}
        onPlay={() => setIsPlayingPreviewAudio(true)}
        onPause={() => setIsPlayingPreviewAudio(false)}
        onEnded={() => setIsPlayingPreviewAudio(false)}
      />

      {/* =====================================================================
          TOP STUDIO HEADER
          ===================================================================== */}
      <header className="kismet-studio-header">
        <div className="kismet-studio-header-left">
          <Link
            href="/#kho-mau-thiep"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 11px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.1)",
              color: "#fbf9f4",
              fontSize: "12px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={13} />
            <span>Kho mẫu</span>
          </Link>

          {/* Template Picker */}
          <div className="kismet-template-select-wrap">
            <span
              className="kismet-hide-on-mobile"
              style={{
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "#d6c7b2",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              Mẫu gốc:
            </span>
            <select
              className="kismet-template-select"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
            >
              {EXACT_TEMPLATES.map((tpl) => (
                <option key={tpl.code} value={tpl.code}>
                  {tpl.name} ({tpl.coupleName})
                </option>
              ))}
            </select>
          </div>

          {onSwitchToClassicBuilder && (
            <button
              type="button"
              onClick={onSwitchToClassicBuilder}
              className="kismet-hide-on-mobile"
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "#d6c7b2",
                fontSize: "11.5px",
                cursor: "pointer",
              }}
            >
              Form Gói 500k/800k
            </button>
          )}
        </div>

        {/* Center Controls: Cover Gate Toggle + Device Mode */}
        <div className="kismet-studio-header-center">
          <button
            type="button"
            onClick={() => setShowCoverGate((prev) => !prev)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 11px",
              borderRadius: "999px",
              border: "1px solid rgba(240, 215, 140, 0.45)",
              background: showCoverGate ? "#7b231f" : "rgba(255,255,255,0.1)",
              color: "#fbf9f4",
              fontSize: "11.5px",
              fontWeight: 500,
              cursor: "pointer",
            }}
            title="Chuyển đổi giữa màn hình Mở Thiệp (Bìa ngoài) và Nội dung bên trong để tiện chỉnh sửa"
          >
            {showCoverGate ? <Mail size={13} /> : <LockOpen size={13} />}
            <span>{showCoverGate ? "Hiện Bìa Mở Thiệp" : "Mở sẵn bên trong"}</span>
          </button>

          <div
            className="kismet-hide-on-mobile"
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "999px",
              padding: "3px",
            }}
          >
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 11px",
                borderRadius: "999px",
                border: 0,
                background: deviceMode === "desktop" ? "#fbf9f4" : "transparent",
                color: deviceMode === "desktop" ? "#1c1917" : "#d6c7b2",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Monitor size={13} />
              <span>Máy tính</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 11px",
                borderRadius: "999px",
                border: 0,
                background: deviceMode === "mobile" ? "#fbf9f4" : "transparent",
                color: deviceMode === "mobile" ? "#1c1917" : "#d6c7b2",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Smartphone size={13} />
              <span>Điện thoại</span>
            </button>
          </div>
        </div>

        {/* Right Actions: Reset & Publish Trial */}
        <div className="kismet-studio-header-right">
          {(modifiedImageCount > 0 || modifiedTextCount > 0) && (
            <button
              type="button"
              onClick={handleResetAllChanges}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.22)",
                background: "transparent",
                color: "#e6dcd2",
                fontSize: "11.5px",
                cursor: "pointer",
              }}
              title="Khôi phục toàn bộ ảnh và chữ về mặc định"
            >
              <RefreshCw size={12} />
              <span>Gốc</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePublishTrial}
            disabled={isPublishing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "999px",
              border: "1px solid #f0d78c",
              background: "linear-gradient(135deg, #8b2622 0%, #681815 100%)",
              color: "#fff8e7",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: isPublishing ? "wait" : "pointer",
              boxShadow: "0 4px 16px rgba(123, 35, 31, 0.45)",
            }}
          >
            <Sparkles size={14} />
            <span>{isPublishing ? "Đang xuất bản…" : "Xuất bản xem thử & Lấy link"}</span>
          </button>
        </div>
      </header>

      {/* MOBILE MODE SWITCHER BAR (Only visible on <= 900px) */}
      <div className="kismet-mobile-mode-switcher">
        <button
          type="button"
          onClick={() => setMobilePane("editor")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 10px",
            borderRadius: "8px",
            border: mobilePane === "editor" ? "1px solid #f0d78c" : "1px solid rgba(255,255,255,0.14)",
            background: mobilePane === "editor" ? "#7b231f" : "rgba(255,255,255,0.06)",
            color: "#fbf9f4",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Camera size={14} />
          <span>1. Thay Ảnh / Chữ / Nhạc</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePane("preview")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 10px",
            borderRadius: "8px",
            border: mobilePane === "preview" ? "1px solid #f0d78c" : "1px solid rgba(255,255,255,0.14)",
            background: mobilePane === "preview" ? "#7b231f" : "rgba(255,255,255,0.06)",
            color: "#fbf9f4",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Eye size={14} />
          <span>2. Xem trực tiếp thiệp</span>
        </button>
      </div>

      {/* Toast message */}
      {statusToast && (
        <div
          style={{
            position: "fixed",
            top: "68px",
            right: "16px",
            left: "16px",
            maxWidth: "420px",
            marginLeft: "auto",
            zIndex: 80,
            padding: "10px 16px",
            borderRadius: "10px",
            background: "#1c1917",
            color: "#f8e7be",
            border: "1px solid rgba(240, 215, 140, 0.45)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
            fontSize: "12.5px",
            fontWeight: 500,
          }}
        >
          {statusToast}
        </div>
      )}

      {/* Published Link Banner if user just published */}
      {publishedUrl && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            padding: "10px 14px",
            background: "#eef7f0",
            borderBottom: "1px solid #86c797",
            color: "#164e27",
            fontSize: "12.5px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <Check size={15} />
            <strong>Đã xuất bản bản xem thử!</strong>
            <span>Gồm mở thiệp + nhạc + ảnh + nội dung bạn vừa chỉnh:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCopyPublishedLink}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #1e6b36",
                background: "#ffffff",
                color: "#164e27",
                fontWeight: 600,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <Copy size={13} />
              <span>{copiedLink ? "Đã sao chép link!" : "Sao chép link"}</span>
            </button>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "#164e27",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={13} />
              <span>Mở xem thiệp vừa xuất bản ↗</span>
            </a>
            <button
              type="button"
              onClick={() => setPublishedUrl(null)}
              style={{
                border: 0,
                background: "transparent",
                color: "#164e27",
                cursor: "pointer",
                padding: "4px",
              }}
              aria-label="Đóng thông báo"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MAIN WORKSPACE: LEFT SIDEBAR + RIGHT EXACT TEMPLATE IFRAME
          ===================================================================== */}
      <div className="kismet-studio-workspace">
        {/* LEFT SIDEBAR: IMAGES / TEXTS / MUSIC */}
        <aside
          className={`kismet-studio-aside ${mobilePane === "preview" ? "is-mobile-hidden" : ""}`}
        >
          {/* 3 Sidebar Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderBottom: "1px solid rgba(30, 27, 24, 0.1)",
              background: "#f3efe6",
            }}
          >
            <button
              type="button"
              onClick={() => setSidebarTab("images")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "12px 6px",
                border: 0,
                borderBottom: sidebarTab === "images" ? "3px solid #7b231f" : "3px solid transparent",
                background: sidebarTab === "images" ? "#fbf9f4" : "transparent",
                color: sidebarTab === "images" ? "#7b231f" : "#5c534a",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <ImageIcon size={14} />
              <span>Thay ảnh ({imageSlots.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSidebarTab("texts")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "12px 6px",
                border: 0,
                borderBottom: sidebarTab === "texts" ? "3px solid #7b231f" : "3px solid transparent",
                background: sidebarTab === "texts" ? "#fbf9f4" : "transparent",
                color: sidebarTab === "texts" ? "#7b231f" : "#5c534a",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <Type size={14} />
              <span>Nội dung ({textSlots.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSidebarTab("music")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "12px 6px",
                border: 0,
                borderBottom: sidebarTab === "music" ? "3px solid #7b231f" : "3px solid transparent",
                background: sidebarTab === "music" ? "#fbf9f4" : "transparent",
                color: sidebarTab === "music" ? "#7b231f" : "#5c534a",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <Music size={14} />
              <span>Nhạc nền</span>
            </button>
          </div>

          {/* Sidebar Scroll Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 74px" }}>
            {/* TAB 1: REPLACE PHOTOS */}
            {sidebarTab === "images" && (
              <div>
                <div
                  style={{
                    padding: "10px 12px",
                    marginBottom: "12px",
                    borderRadius: "10px",
                    background: "#f4ece1",
                    border: "1px solid rgba(123, 35, 31, 0.18)",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    color: "#4a3f37",
                  }}
                >
                  💡 <strong>Mẹo nhanh:</strong> Chọn <strong>Đổi ảnh</strong> ở từng khung bên dưới, hoặc chuyển sang{" "}
                  <strong>Xem trực tiếp thiệp</strong> và chạm trực tiếp vào bức ảnh trên thiệp để thay.
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                  {imageSlots.map((slot) => {
                    const isCustom = Boolean(imageMap[slot.id]);
                    const isSelected = activeImageSlotId === slot.id;
                    return (
                      <div
                        key={slot.id}
                        style={{
                          border: isSelected
                            ? "2px solid #c81912"
                            : isCustom
                              ? "2px solid #1e6b36"
                              : "1px solid rgba(30,27,24,0.14)",
                          borderRadius: "10px",
                          padding: "8px",
                          background: "#ffffff",
                          display: "flex",
                          flexDirection: "column",
                          gap: "7px",
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "4 / 4.2",
                            borderRadius: "6px",
                            overflow: "hidden",
                            background: "#ece8df",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageMap[slot.id] || slot.currentSrc}
                            alt={slot.label}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                          {isCustom && (
                            <span
                              style={{
                                position: "absolute",
                                top: "6px",
                                left: "6px",
                                padding: "2px 7px",
                                borderRadius: "999px",
                                background: "#1e6b36",
                                color: "#ffffff",
                                fontSize: "10px",
                                fontWeight: 700,
                              }}
                            >
                              Đã thay
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#2c2622",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={slot.label}
                        >
                          {slot.label}
                        </div>

                        <div style={{ display: "flex", gap: "5px" }}>
                          <label
                            style={{
                              flex: 1,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                              padding: "6px 6px",
                              borderRadius: "6px",
                              background: "#7b231f",
                              color: "#ffffff",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                          >
                            <Camera size={12} />
                            <span>Đổi ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                void handleReplaceImageFile(slot.id, file);
                                e.target.value = "";
                              }}
                            />
                          </label>

                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetSingleImage(slot.id)}
                              style={{
                                padding: "6px 7px",
                                borderRadius: "6px",
                                border: "1px solid rgba(30,27,24,0.2)",
                                background: "#f5f2eb",
                                color: "#4a433d",
                                fontSize: "11px",
                                cursor: "pointer",
                              }}
                              title="Khôi phục ảnh gốc"
                            >
                              Gốc
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: REPLACE TEXT CONTENT */}
            {sidebarTab === "texts" && (
              <div>
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                    background: "#fbf9f4",
                    paddingBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(30,27,24,0.2)",
                      background: "#ffffff",
                    }}
                  >
                    <Search size={15} color="#786f66" />
                    <input
                      type="text"
                      value={textSearch}
                      onChange={(e) => setTextSearch(e.target.value)}
                      placeholder="Tìm nội dung (tên dâu rể, ngày cưới, địa điểm...)"
                      style={{
                        border: 0,
                        outline: "none",
                        width: "100%",
                        fontSize: "12.5px",
                        background: "transparent",
                      }}
                    />
                    {textSearch && (
                      <button
                        type="button"
                        onClick={() => setTextSearch("")}
                        style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  {filteredTextSlots.map((slot) => {
                    const currentVal = textMap[slot.id] !== undefined ? textMap[slot.id] : slot.origText;
                    const isModified = textMap[slot.id] !== undefined && textMap[slot.id] !== slot.origText;
                    const isFocused = activeTextSlotId === slot.id;

                    return (
                      <div
                        key={slot.id}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "9px",
                          background: "#ffffff",
                          border: isFocused
                            ? "2px solid #7b231f"
                            : isModified
                              ? "1.5px solid #1e6b36"
                              : "1px solid rgba(30,27,24,0.12)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "6px",
                          }}
                        >
                          <label
                            htmlFor={`editor-txt-field-${slot.id}`}
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: "#7b231f",
                            }}
                          >
                            {slot.label}
                          </label>
                          {isModified && (
                            <button
                              type="button"
                              onClick={() => handleResetSingleText(slot.id)}
                              style={{
                                border: 0,
                                background: "transparent",
                                color: "#786f66",
                                fontSize: "11px",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              Khôi phục gốc
                            </button>
                          )}
                        </div>

                        {slot.multiline ? (
                          <textarea
                            id={`editor-txt-field-${slot.id}`}
                            rows={3}
                            value={currentVal}
                            onFocus={() => setActiveTextSlotId(slot.id)}
                            onChange={(e) => handleChangeText(slot.id, e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              borderRadius: "6px",
                              border: "1px solid rgba(30,27,24,0.18)",
                              fontSize: "13px",
                              lineHeight: 1.45,
                              resize: "vertical",
                              boxSizing: "border-box",
                            }}
                          />
                        ) : (
                          <input
                            id={`editor-txt-field-${slot.id}`}
                            type="text"
                            value={currentVal}
                            onFocus={() => setActiveTextSlotId(slot.id)}
                            onChange={(e) => handleChangeText(slot.id, e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px 10px",
                              borderRadius: "6px",
                              border: "1px solid rgba(30,27,24,0.18)",
                              fontSize: "13px",
                              boxSizing: "border-box",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: REPLACE BACKGROUND MUSIC */}
            {sidebarTab === "music" && (
              <div style={{ display: "grid", gap: "14px" }}>
                {/* Currently selected music box */}
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#ffffff",
                    border: "1.5px solid #7b231f",
                  }}
                >
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#7b231f", fontWeight: 700 }}>
                    Nhạc nền đang gắn vào thiệp
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, margin: "4px 0 10px", color: "#1e1b18" }}>
                    ♪ {musicTitle}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => {
                        const audio = previewAudioRef.current;
                        if (!audio) return;
                        if (isPlayingPreviewAudio) {
                          audio.pause();
                        } else {
                          audio.play().catch(() => {});
                        }
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 13px",
                        borderRadius: "8px",
                        border: 0,
                        background: "#7b231f",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {isPlayingPreviewAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      <span>{isPlayingPreviewAudio ? "Tạm dừng nghe thử" : "Nghe thử bài đang chọn"}</span>
                    </button>

                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 13px",
                        borderRadius: "8px",
                        border: "1px solid rgba(30,27,24,0.24)",
                        background: "#f6f3eb",
                        color: "#1e1b18",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Upload size={13} />
                      <span>Tải nhạc từ máy (.mp3/.m4a)</span>
                      <input
                        type="file"
                        accept="audio/*"
                        style={{ display: "none" }}
                        onChange={handleUploadCustomMusic}
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Wedding Songs Library */}
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#4a433d", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Kho nhạc cưới chọn lọc ({WEDDING_SONGS.length} bài)
                </div>

                <div style={{ display: "grid", gap: "8px" }}>
                  {[...WEDDING_SONGS]
                    .sort((a, b) =>
                      a.id === "leehi-only" || a.id === "young-and-beautiful-khong-loi"
                        ? -1
                        : b.id === "leehi-only" || b.id === "young-and-beautiful-khong-loi"
                          ? 1
                          : 0,
                    )
                    .map((song) => {
                      const isSelected = musicSrc === song.src;
                      return (
                        <div
                          key={song.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            background: isSelected ? "#fdf6ee" : "#ffffff",
                            border: isSelected ? "1.5px solid #7b231f" : "1px solid rgba(30,27,24,0.12)",
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#1e1b18",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {song.title}
                            </div>
                            <div style={{ fontSize: "11px", color: "#786f66" }}>{song.artist}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setMusicSrc(song.src);
                              setMusicTitle(song.title);
                              showToast(`Đã chọn bài: ${song.title}`);
                            }}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: isSelected ? "1px solid #7b231f" : "1px solid rgba(30,27,24,0.2)",
                              background: isSelected ? "#7b231f" : "#f6f3eb",
                              color: isSelected ? "#ffffff" : "#1e1b18",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            {isSelected ? "Đang dùng" : "Chọn bài này"}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANE: LIVE EXACT TEMPLATE IFRAME */}
        <main
          className={`kismet-studio-main ${mobilePane === "editor" ? "is-mobile-hidden" : ""}`}
          style={{
            padding: deviceMode === "mobile" ? "20px" : "0",
          }}
        >
          <div
            className="kismet-studio-main-frame"
            style={{
              width: deviceMode === "mobile" ? "395px" : "100%",
              height: deviceMode === "mobile" ? "min(840px, 92%)" : "100%",
              maxWidth: "100%",
              borderRadius: deviceMode === "mobile" ? "34px" : "0",
              border: deviceMode === "mobile" ? "10px solid #231f1d" : "0",
              boxShadow: deviceMode === "mobile" ? "0 24px 60px rgba(0,0,0,0.3)" : "none",
              overflow: "hidden",
              background: "#f3f0e8",
            }}
          >
            <iframe
              key={currentTemplate.code}
              ref={iframeRef}
              src={`${currentTemplate.iframeSrc}?v=studio-edit`}
              title={`Chỉnh sửa mẫu thiệp ${currentTemplate.name}`}
              allow="autoplay"
              style={{
                width: "100%",
                height: "100%",
                border: 0,
                display: "block",
              }}
              onLoad={() => {
                syncIframeDom();
                window.setTimeout(syncIframeDom, 250);
                window.setTimeout(syncIframeDom, 800);
              }}
            />
          </div>
        </main>
      </div>

      {/* Floating bottom quick-switch button on mobile viewports */}
      <button
        type="button"
        className="kismet-mobile-floating-toggle"
        onClick={() => setMobilePane((prev) => (prev === "editor" ? "preview" : "editor"))}
      >
        {mobilePane === "editor" ? (
          <>
            <Eye size={16} />
            <span>Xem thiệp trực tiếp</span>
          </>
        ) : (
          <>
            <Camera size={16} />
            <span>Quay lại sửa Ảnh / Chữ</span>
          </>
        )}
      </button>
    </div>
  );
}
