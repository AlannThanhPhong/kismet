"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ExternalLink, Monitor, Smartphone, Volume2, X } from "lucide-react";
import type { WeddingTemplateItem } from "@/lib/templates-data";

interface LivePreviewModalProps {
  template: WeddingTemplateItem | null;
  onClose: () => void;
  onChoose: (template: WeddingTemplateItem) => void;
}

export default function LivePreviewModal({ template, onClose, onChoose }: LivePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!template) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const modal = modalRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !modal) return;

      // Let Tab move through the embedded invitation normally; wrap only at
      // the outer dialog controls, with the iframe included in their order.
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const activeElement = document.activeElement;
      if (e.shiftKey && activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const containFocus = (e: FocusEvent) => {
      if (e.target instanceof Node && modal && !modal.contains(e.target)) {
        closeButtonRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", containFocus);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", containFocus);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [template, onClose]);

  if (!template) return null;

  const demoUrl = template.liveDemoUrl || `/thiep/${template.code}`;

  return (
    <div ref={modalRef} className="preview-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="preview-modal-title">
      <div className="preview-modal-container">
        {/* Modal Top Bar */}
        <div className="preview-modal-header">
          <div className="preview-header-info">
            <span className="preview-badge">{template.badge || "MẪU THIỆP THỰC TẾ"}</span>
            <h3 id="preview-modal-title">{template.name}</h3>
            <p className="preview-subtitle">{template.coupleName} · {template.tone}</p>
          </div>

          {/* Device Switcher (Mobile vs Desktop) */}
          <div className="device-switcher" role="group" aria-label="Chọn thiết bị xem trước">
            <button
              type="button"
              className={`device-btn ${deviceMode === "mobile" ? "is-active" : ""}`}
              onClick={() => setDeviceMode("mobile")}
              aria-pressed={deviceMode === "mobile"}
              title="Xem giao diện Điện Thoại"
            >
              <Smartphone size={16} />
              <span>Điện thoại</span>
            </button>
            <button
              type="button"
              className={`device-btn ${deviceMode === "desktop" ? "is-active" : ""}`}
              onClick={() => setDeviceMode("desktop")}
              aria-pressed={deviceMode === "desktop"}
              title="Xem giao diện Máy Tính"
            >
              <Monitor size={16} />
              <span>Máy tính</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="preview-header-actions">
            {template.tryUrl && (
              <a
                href={template.tryUrl}
                className="preview-try-btn"
                aria-label="Thử thay ảnh của bạn vào mẫu"
                title="Tải ảnh của bạn vào xem thử"
              >
                <Camera size={15} />
                <span className="hide-on-mobile">Thử thay ảnh</span>
              </a>
            )}
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-ext-btn"
              aria-label="Mở thiệp trong tab mới"
              title="Mở toàn màn hình trong tab mới"
            >
              <ExternalLink size={15} />
              <span className="hide-on-mobile">Mở tab mới</span>
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              className="preview-close-btn"
              onClick={onClose}
              aria-label="Đóng cửa sổ xem thử"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body / Device Frame */}
        <div className="preview-modal-body">
          {deviceMode === "mobile" ? (
            <div className="mobile-mockup-frame">
              {/* iPhone style hardware speaker / island */}
              <div className="mobile-island">
                <span className="mobile-speaker" />
                <span className="mobile-camera" />
              </div>
              <div className="mobile-screen">
                <iframe
                  src={demoUrl}
                  title={`Xem thử thiệp cưới ${template.name} trên điện thoại`}
                  className="preview-iframe mobile-iframe"
                  allow="autoplay"
                />
              </div>
              <div className="mobile-home-indicator" />
            </div>
          ) : (
            <div className="desktop-mockup-frame">
              {/* Desktop Browser Window Frame */}
              <div className="desktop-browser-bar">
                <div className="browser-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="browser-url-bar">
                  <span className="browser-lock">🔒</span>
                  <span className="browser-url" title={demoUrl}>{demoUrl}</span>
                </div>
                <div className="browser-audio-hint">
                  <Volume2 size={13} />
                  <span>Có nhạc nền</span>
                </div>
              </div>
              <div className="desktop-screen">
                <iframe
                  src={demoUrl}
                  title={`Xem thử thiệp cưới ${template.name} trên máy tính`}
                  className="preview-iframe desktop-iframe"
                  allow="autoplay"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="preview-modal-footer">
          <div className="preview-features-tags">
            {template.hasMusic && <span className="p-tag">🎵 Nhạc nền</span>}
            {template.hasRsvp && <span className="p-tag">💌 RSVP</span>}
            {template.hasMap && <span className="p-tag">🗺️ Google Maps</span>}
            {template.hasQr && <span className="p-tag">🎁 Hộp mừng cưới</span>}
            {template.hasGallery && <span className="p-tag">📸 Album ảnh</span>}
          </div>
          <div className="preview-footer-cta">
            <button type="button" onClick={() => onChoose(template)} className="button button-wine btn-sm">
              Chọn mẫu thiệp này ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
