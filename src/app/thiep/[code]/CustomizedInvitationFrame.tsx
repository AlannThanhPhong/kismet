"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { applyCustomizationsToDoc } from "@/lib/template-customizer-bridge";
import type { PublishedTrialPayload } from "@/app/api/published-trials/route";

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
  const [loadingTrial, setLoadingTrial] = useState<boolean>(Boolean(customId));

  useEffect(() => {
    if (!customId) {
      setTrialData(null);
      setLoadingTrial(false);
      return;
    }

    let cancelled = false;
    setLoadingTrial(true);

    async function loadTrial() {
      try {
        const cached = localStorage.getItem(`kismet-published-trial-${customId}`);
        if (cached) {
          const parsed = JSON.parse(cached) as PublishedTrialPayload;
          if (!cancelled && parsed) {
            setTrialData(parsed);
            setLoadingTrial(false);
          }
        }
      } catch {
        // Ignore storage error
      }

      try {
        const res = await fetch(`/api/published-trials/${encodeURIComponent(customId!)}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = (await res.json()) as { record?: PublishedTrialPayload };
          if (!cancelled && json.record) {
            setTrialData(json.record);
          }
        }
      } catch {
        // Keep local cache if offline
      } finally {
        if (!cancelled) {
          setLoadingTrial(false);
        }
      }
    }

    loadTrial();
    return () => {
      cancelled = true;
    };
  }, [customId]);

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

    if (trialData) {
      applyCustomizationsToDoc(doc, {
        imageMap: trialData.imageMap,
        textMap: trialData.textMap,
        musicSrc: trialData.musicSrc,
        musicTitle: trialData.musicTitle,
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
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
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
