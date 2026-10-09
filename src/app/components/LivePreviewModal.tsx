"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Maximize2, Monitor, Smartphone, Volume2, X } from "lucide-react";
import type { WeddingTemplateItem } from "@/lib/templates-data";

interface LivePreviewModalProps {
  template: WeddingTemplateItem | null;
  onClose: () => void;
}

export default function LivePreviewModal({ template, onClose }: LivePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    if (!template) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [template, onClose]);

  if (!template) return null;

  const demoUrl = template.liveDemoUrl || `/thiep/${template.code}`;

  return (
    <div className="preview-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="preview-modal-title">
      <div className="preview-modal-container">
        {/* Modal Top Bar */}
        <div className="preview-modal-header">
          <div className="preview-header-info">
            <span className="preview-badge">{template.badge || "MẪU THIỆP THỰC TẾ"}</span>
            <h3 id="preview-modal-title">{template.name}</h3>
            <p className="preview-subtitle">{template.coupleName} · {template.tone}</p>
          </div>

          {/* Device Switcher (Mobile vs Desktop) */}
          <div className="device-switcher" role="radiogroup" aria-label="Chọn thiết bị xem trước">
            <button
              type="button"
              className={`device-btn ${deviceMode === "mobile" ? "is-active" : ""}`}
              onClick={() => setDeviceMode("mobile")}
              aria-checked={deviceMode === "mobile"}
              role="radio"
              title="Xem giao diện Điện Thoại"
            >
              <Smartphone size={16} />
              <span>Điện thoại</span>
            </button>
            <button
              type="button"
              className={`device-btn ${deviceMode === "desktop" ? "is-active" : ""}`}
              onClick={() => setDeviceMode("desktop")}
              aria-checked={deviceMode === "desktop"}
              role="radio"
              title="Xem giao diện Máy Tính"
            >
              <Monitor size={16} />
              <span>Máy tính</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="preview-header-actions">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-ext-btn"
              title="Mở toàn màn hình trong tab mới"
            >
              <ExternalLink size={15} />
              <span className="hide-on-mobile">Mở tab mới</span>
            </a>
            <button
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
                  <span className="browser-url">kismetlove.me/thiep/{template.code}</span>
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
            <a href="#bat-dau" onClick={onClose} className="button button-wine btn-sm">
              Chọn mẫu thiệp này ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
