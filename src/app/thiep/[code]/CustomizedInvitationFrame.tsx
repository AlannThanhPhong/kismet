"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { applyCustomizationsToDoc, loadTrialFromIndexedDb } from "@/lib/template-customizer-bridge";
import type { PublishedTrialPayload } from "@/lib/published-trials-store";

interface Props {
  code: string;
  src: string;
  title: string;
}

function CustomizedInvitationFrameInner({ code, src, title }: Props) {
  const searchParams = useSearchParams();
  const customId = searchParams.get("custom");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [trialData, setTrialData] = useState<PublishedTrialPayload | null>(null);
  const trialDataRef = useRef<PublishedTrialPayload | null>(null);
  const [loadingTrial, setLoadingTrial] = useState<boolean>(Boolean(customId));

  const updateTrialData = useCallback((next: PublishedTrialPayload | null) => {
    trialDataRef.current = next;
    setTrialData(next);
  }, []);

  useEffect(() => {
    if (!customId) {
      updateTrialData(null);
      setLoadingTrial(false);
      return;
    }

    let cancelled = false;
    setLoadingTrial(true);

    async function loadTrial() {
      let resolved: PublishedTrialPayload | null = null;

      // 1. Check IndexedDB first (handles large multi-photo trials that exceed 5MB localStorage)
      try {
        const idbRecord = await loadTrialFromIndexedDb<PublishedTrialPayload>(
          `kismet-published-trial-${customId}`,
        );
        if (idbRecord && !cancelled) {
          resolved = idbRecord;
          updateTrialData(idbRecord);
          setLoadingTrial(false);
        }
      } catch {
        // Ignore IDB errors
      }

      // 2. Check localStorage cache
      if (!resolved) {
        try {
          const cached = localStorage.getItem(`kismet-published-trial-${customId}`);
          if (cached) {
            const parsed = JSON.parse(cached) as PublishedTrialPayload;
            if (!cancelled && parsed) {
              resolved = parsed;
              updateTrialData(parsed);
              setLoadingTrial(false);
            }
          }
        } catch {
          // Ignore storage error
        }
      }

      // 3. Fetch from server API (/api/published-trials/[id])
      try {
        const res = await fetch(`/api/published-trials/${encodeURIComponent(customId!)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = (await res.json()) as { record?: PublishedTrialPayload };
          if (!cancelled && json.record) {
            resolved = json.record;
            updateTrialData(json.record);
          }
        }
      } catch {
        // Keep local cache if offline
      }

      // 4. Fallback to current template draft on the same device if trial ID wasn't found remotely
      if (!resolved && !cancelled) {
        try {
          const draftIdb = await loadTrialFromIndexedDb<PublishedTrialPayload>(
            `kismet-exact-draft-${code}`,
          );
          if (draftIdb) {
            resolved = draftIdb;
            updateTrialData(draftIdb);
          } else {
            const draftLocal = localStorage.getItem(`kismet-exact-draft-${code}`);
            if (draftLocal) {
              const parsedDraft = JSON.parse(draftLocal) as PublishedTrialPayload;
              if (parsedDraft) {
                resolved = parsedDraft;
                updateTrialData(parsedDraft);
              }
            }
          }
        } catch {
          // Ignore fallback errors
        }
      }

      if (!cancelled) {
        setLoadingTrial(false);
      }
    }

    void loadTrial();
    return () => {
      cancelled = true;
    };
  }, [customId, code, updateTrialData]);

  const REAL_PROJECT_CODES = new Set([
    "20260323-NDNL",
    "20261027-KHVT",
    "20261230-KHAG",
    "20260823-NDTD",
    "20260110-NHVVAM",
    "20260711-AHDE",
  ]);

  const injectBottomCustomizeFooter = useCallback(
    (doc: Document) => {
      if (!doc || !doc.body) return;
      if (REAL_PROJECT_CODES.has(code)) {
        const existing = doc.getElementById("kismet-end-of-invitation-cta");
        if (existing) existing.remove();
        return;
      }

      const targetHref = customId
        ? `/tao-thiep?template=${encodeURIComponent(code)}&custom=${encodeURIComponent(customId)}`
        : `/tao-thiep?template=${encodeURIComponent(code)}`;

      let footerWrap = doc.getElementById("kismet-end-of-invitation-cta");
      if (!footerWrap) {
        footerWrap = doc.createElement("div");
        footerWrap.id = "kismet-end-of-invitation-cta";
        footerWrap.style.cssText = [
          "width: 100%",
          "padding: 28px 16px 40px",
          "text-align: center",
          "background: transparent",
          "position: relative",
          "z-index: 20",
        ].join(";");

        const linkBtn = doc.createElement("a");
        linkBtn.id = "kismet-end-of-invitation-link";
        linkBtn.href = targetHref;
        linkBtn.target = "_top";
        linkBtn.style.cssText = [
          "display: inline-flex",
          "align-items: center",
          "justify-content: center",
          "gap: 8px",
          "padding: 11px 22px",
          "border-radius: 999px",
          "background: rgba(28, 24, 21, 0.88)",
          "color: #fbf9f4",
          "border: 1px solid rgba(240, 215, 140, 0.45)",
          "font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif",
          "font-size: 12.5px",
          "font-weight: 600",
          "letter-spacing: 0.04em",
          "text-decoration: none",
          "box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16)",
          "cursor: pointer",
        ].join(";");

        footerWrap.appendChild(linkBtn);
        doc.body.appendChild(footerWrap);
      }

      const linkEl = doc.getElementById("kismet-end-of-invitation-link") as HTMLAnchorElement | null;
      if (linkEl) {
        linkEl.href = targetHref;
        linkEl.textContent = customId
          ? "✦ Thử mẫu này (Chỉnh sửa tiếp)"
          : "✦ Thử mẫu này";
      }
    },
    [code, customId],
  );

  const syncIframeContent = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc || !doc.body) return;

    const activeTrial = trialDataRef.current || trialData;
    if (activeTrial) {
      applyCustomizationsToDoc(doc, {
        imageMap: activeTrial.imageMap,
        textMap: activeTrial.textMap,
        musicSrc: activeTrial.musicSrc,
        musicTitle: activeTrial.musicTitle,
      });
    }

    injectBottomCustomizeFooter(doc);
  }, [trialData, injectBottomCustomizeFooter]);

  useEffect(() => {
    syncIframeContent();

    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.body) return;

    let rafId = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        syncIframeContent();
      });
    });

    observer.observe(doc.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [syncIframeContent]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden" }}>
      {loadingTrial && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f3f0e8",
            color: "#7b231f",
            fontFamily: "Georgia, serif",
            fontSize: "18px",
            letterSpacing: "0.08em",
          }}
        >
          Đang tải thiệp cưới của bạn…
        </div>
      )}

      <iframe
        ref={iframeRef}
        className="full-invitation"
        src={src}
        allow="autoplay"
        title={title}
        onLoad={() => {
          syncIframeContent();
          window.setTimeout(syncIframeContent, 180);
          window.setTimeout(syncIframeContent, 600);
          window.setTimeout(syncIframeContent, 1200);
        }}
      />
    </div>
  );
}

export default function CustomizedInvitationFrame(props: Props) {
  return (
    <Suspense
      fallback={
        <iframe
          className="full-invitation"
          src={props.src}
          allow="autoplay"
          title={props.title}
        />
      }
    >
      <CustomizedInvitationFrameInner {...props} />
    </Suspense>
  );
}
