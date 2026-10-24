"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { applyCustomizationsToDoc } from "@/lib/template-customizer-bridge";
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
  const [trialCanEdit, setTrialCanEdit] = useState(false);
  const [trialError, setTrialError] = useState<{ message: string; expiresAt?: string | null } | null>(null);
  const trialDataRef = useRef<PublishedTrialPayload | null>(null);
  const [loadingTrial, setLoadingTrial] = useState<boolean>(Boolean(customId));

  const updateTrialData = useCallback((next: PublishedTrialPayload | null) => {
    trialDataRef.current = next;
    setTrialData(next);
  }, []);

  useEffect(() => {
    if (!customId) {
      updateTrialData(null);
      setTrialCanEdit(false);
      setTrialError(null);
      setLoadingTrial(false);
      return;
    }

    let cancelled = false;
    updateTrialData(null);
    setTrialCanEdit(false);
    setTrialError(null);
    setLoadingTrial(true);

    async function loadTrial() {
      try {
        const res = await fetch(`/api/published-trials/${encodeURIComponent(customId!)}`, {
          cache: "no-store",
        });
        const json = await res.json().catch(() => null) as {
          record?: PublishedTrialPayload;
          error?: string;
          expiresAt?: string | null;
          canEdit?: boolean;
        } | null;
        if (res.status === 410) {
          if (!cancelled) setTrialError({
            message: json?.error || "Thiệp này đã hết hạn.",
            expiresAt: json?.expiresAt,
          });
          return;
        }
        if (!res.ok) throw new Error(json?.error || "Chưa thể tải thiệp này.");
        if (json?.record && !cancelled && json.record.templateCode === code) {
          updateTrialData(json.record);
          setTrialCanEdit(Boolean(json.canEdit));
        } else if (!cancelled) {
          throw new Error("Không tìm thấy nội dung thiệp này.");
        }
      } catch (error) {
        if (!cancelled) setTrialError({
          message: error instanceof Error ? error.message : "Chưa thể tải thiệp. Vui lòng thử lại sau.",
        });
      }

      finally {
        if (!cancelled) setLoadingTrial(false);
      }
    }

    void loadTrial();
    return () => {
      cancelled = true;
    };
  }, [customId, code, updateTrialData]);

  useEffect(() => {
    if (!customId) return;

    let stopped = false;
    let timer = 0;
    const checkAvailability = async () => {
      if (stopped) return;
      try {
        const response = await fetch(`/api/published-trials/${encodeURIComponent(customId)}`, { cache: "no-store" });
        if (response.status !== 410) return;
        const result = await response.json().catch(() => null) as { error?: string; expiresAt?: string | null } | null;
        stopped = true;
        window.clearInterval(timer);
        updateTrialData(null);
        setTrialCanEdit(false);
        setTrialError({
          message: result?.error || "Thiệp này hiện không khả dụng.",
          expiresAt: result?.expiresAt,
        });
      } catch {
        // Keep the already loaded invitation visible during a temporary network failure.
      }
    };
    const onVisibilityChange = () => {
      if (!document.hidden) void checkAvailability();
    };

    timer = window.setInterval(() => void checkAvailability(), 30_000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [customId, updateTrialData]);

  useEffect(() => {
    if (!customId || !trialData?.expiresAt) return;
    const remaining = new Date(trialData.expiresAt).getTime() - Date.now();
    if (remaining <= 0) {
      updateTrialData(null);
      setTrialError({ message: "Thiệp này đã hết hạn.", expiresAt: trialData.expiresAt });
      return;
    }
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/published-trials/${encodeURIComponent(customId)}`, { cache: "no-store" });
          const result = await response.json().catch(() => null) as {
            record?: PublishedTrialPayload;
            error?: string;
            expiresAt?: string | null;
            canEdit?: boolean;
          } | null;
          if (response.ok && result?.record) {
            updateTrialData(result.record);
            setTrialCanEdit(Boolean(result.canEdit));
            return;
          }
          updateTrialData(null);
          setTrialError({
            message: result?.error || "Thiệp này đã hết hạn.",
            expiresAt: result?.expiresAt || trialData.expiresAt,
          });
        } catch {
          updateTrialData(null);
          setTrialError({ message: "Không thể kiểm tra hạn thiệp. Vui lòng tải lại trang." });
        }
      })();
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [customId, trialData?.expiresAt, updateTrialData]);

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

      const targetHref = customId && trialCanEdit
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
        linkEl.textContent = customId && trialCanEdit
          ? "✦ Thử mẫu này (Chỉnh sửa tiếp)"
          : "✦ Thử mẫu này";
      }
    },
    [code, customId, trialCanEdit],
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

      {trialError && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center",
          justifyContent: "center", padding: 24, background: "#f3f0e8", color: "#514139",
          fontFamily: "Arial, sans-serif", textAlign: "center",
        }}>
          <div style={{ maxWidth: 440 }}>
            <p style={{ color: "#9b755d", fontSize: 11, letterSpacing: ".16em", fontWeight: 700 }}>KISMET LOVE</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 30 }}>{trialError.message}</h1>
            {trialError.expiresAt && <p>Hết hạn lúc {new Date(trialError.expiresAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })}.</p>}
            <p>Chủ tài khoản có thể xem trạng thái thiệp trong trang tài khoản. Liên hệ quản trị viên để hỏi về việc mở lại hoặc gia hạn thiệp.</p>
            <a href="/tai-khoan" style={{ display: "inline-block", marginTop: 10, padding: "11px 18px", borderRadius: 999, background: "#762c29", color: "#fff9ee", textDecoration: "none", fontSize: 13 }}>Đến trang tài khoản</a>
          </div>
        </div>
      )}

      {(!customId || Boolean(trialData)) && <iframe
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
      />}
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
