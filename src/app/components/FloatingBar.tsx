"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Heart, Phone, Sparkles } from "lucide-react";

export default function FloatingBar() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Sticky Bottom Action Bar */}
      <nav className="mobile-bottom-action-bar" aria-label="Thao tác nhanh trên điện thoại">
        <a
          href="tel:0827274387"
          className="bottom-bar-action bar-action-phone"
        >
          <span className="action-icon-pill phone-bg">
            <Phone size={18} />
          </span>
          <span>Gọi tư vấn</span>
        </a>

        <a href="#kho-mau-thiep" className="bottom-bar-action bar-action-templates">
          <span className="action-icon-pill heart-bg">
            <Heart size={18} />
          </span>
          <span>Kho Mẫu Thiệp</span>
        </a>

        <a href="#bat-dau" className="bottom-bar-action bar-action-primary">
          <span className="action-icon-pill primary-bg">
            <Sparkles size={18} />
          </span>
          <span>Tạo Thiệp Ngay</span>
        </a>
      </nav>

      {/* Floating Action Buttons (Desktop & Tablet) */}
      <aside className="desktop-floating-actions" aria-label="Hỗ trợ trực tuyến">
        <a
          href="tel:0827274387"
          className="floating-btn floating-phone"
          aria-label="Gọi tư vấn: 0827274387"
          title="Gọi tư vấn: 0827274387"
        >
          <Phone size={22} />
          <span className="floating-tooltip">Gọi tư vấn</span>
          <span className="phone-ping-pulse" aria-hidden="true" />
        </a>

        {showScrollTop && (
          <button
            type="button"
            className="floating-btn floating-top"
            onClick={scrollToTop}
            aria-label="Cuộn lên đầu trang"
            title="Về đầu trang"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </aside>
    </>
  );
}
