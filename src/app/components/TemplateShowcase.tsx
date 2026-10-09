"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, Eye, Heart, Monitor, Smartphone, Sparkles } from "lucide-react";
import { templatesForCurrency, type TemplateCategory, type WeddingTemplateItem } from "@/lib/templates-data";
import { packagePrice, type PricingCurrency } from "@/lib/pricing";
import LivePreviewModal from "./LivePreviewModal";
import ConsultationButton, { ConsultationDialog } from "./ConsultationButton";

const CATEGORIES: { key: TemplateCategory; label: string }[] = [
  { key: "all", label: "Tất cả mẫu thiệp" },
  { key: "modern", label: "Trong Trẻo / Minimal" },
  { key: "vintage", label: "Hoài Niệm / Film" },
];

export default function TemplateShowcase({ currency }: { currency: PricingCurrency }) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("all");
  const [selectedPreview, setSelectedPreview] = useState<WeddingTemplateItem | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<WeddingTemplateItem | null>(null);
  const templates = useMemo(() => templatesForCurrency(currency), [currency]);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return templates;
    return templates.filter((item) => item.category === activeCategory);
  }, [activeCategory, templates]);

  return (
    <section className="template-showcase-section section-wrap" id="kho-mau-thiep" aria-labelledby="catalog-title">
      {/* Section Header */}
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">01 / KHO GIAO DIỆN THIỆP CƯỚI ĐIỆN TỬ</p>
        <h2 id="catalog-title">
          Chọn phong cách riêng<br />
          <em>cho câu chuyện của hai bạn</em>
        </h2>
        <p className="section-subheading">
          Khám phá các mẫu thiệp cưới trực quan: Mẫu Tiêu Chuẩn {packagePrice("standard", currency)}, Mẫu Nâng Cao {packagePrice("premium", currency)} (Kim Hiên & Văn Tài), và Mẫu May Đo Độc Bản {packagePrice("bespoke", currency)} (Huyền Vy & Anh Minh)
          Bạn có thể thử thay ảnh của chính mình vào mẫu Tiêu Chuẩn và Nâng Cao để xem trước diện mạo thiệp
        </p>

        {/* Device compatibility badge */}
        <div className="device-assurance-pills">
          <span className="pill-item">
            <Smartphone size={14} /> Tối ưu vuốt chạm trên điện thoại
          </span>
          <span className="pill-dot">·</span>
          <span className="pill-item">
            <Monitor size={14} /> Trình chiếu rực rỡ trên máy tính
          </span>
          <span className="pill-dot">·</span>
          <span className="pill-item">
            <Sparkles size={14} /> Hiệu ứng & âm nhạc lãng mạn
          </span>
        </div>
      </div>

      {/* Interactive Try Photos Banner */}
      <div className="try-photos-promo-banner" data-reveal>
        <div className="promo-banner-text">
          <div className="promo-banner-badge">
            <Sparkles size={13} />
            <span>THỬ ẢNH CƯỚI CỦA BẠN</span>
          </div>
          <h3>Ướm ảnh của hai bạn vào mẫu thiệp yêu thích</h3>
          <p>Tải ảnh từ điện thoại hoặc máy tính để xem thử mẫu Tiêu Chuẩn và Nâng Cao trước khi đặt dịch vụ</p>
        </div>
        <div className="promo-banner-actions">
          <Link href="/thu-thiep?package=standard" className="btn-banner-try-500k">
            <Camera size={14} />
            <span>Thử mẫu Tiêu Chuẩn</span>
          </Link>
          <Link href="/thu-thiep?package=premium" className="btn-banner-try-800k">
            <Camera size={14} />
            <span>Thử mẫu Nâng Cao</span>
          </Link>
        </div>
      </div>

      {/* Style filters */}
      <div className="category-filters-wrapper" data-reveal>
        <div className="category-filters" role="group" aria-label="Bộ lọc phong cách thiệp cưới">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              aria-pressed={activeCategory === cat.key}
              aria-controls="template-results"
              className={`filter-pill ${activeCategory === cat.key ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
              {cat.key === "all" ? (
                <span className="pill-count">{templates.length}</span>
              ) : (
                <span className="pill-count">
                  {templates.filter((t) => t.category === cat.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Template cards keep their width when filtering. */}
      <div className="templates-showcase-grid" id="template-results" data-reveal>
        {filteredTemplates.map((item, idx) => (
          <article className="template-card-item" key={item.id}>
            {/* Card Preview Window */}
            <div className="template-card-preview">
              {/* Badge */}
              {item.badge && (
                <span className={`template-badge badge-${item.badgeType || "default"}`}>
                  {item.badge}
                </span>
              )}

              {/* Quick index stamp */}
              <span className="template-card-num">{(templates.indexOf(item) + 1).toString().padStart(2, "0")}</span>

              {/* Cover image */}
              <div className="template-image-scroll-frame">
                <Image
                  src={item.coverImage}
                  alt={`Thiệp cưới ${item.name} - ${item.coupleName}`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 342px"
                  className="template-scroll-image"
                  priority={idx === 0}
                />
              </div>

              {/* Hover overlay with action buttons */}
              <div className="template-card-overlay">
                <div className="overlay-actions">
                  <button
                    type="button"
                    className="action-btn-preview"
                    onClick={() => setSelectedPreview(item)}
                    aria-label={`Xem thử thiệp ${item.name} trên điện thoại và máy tính`}
                  >
                    <Eye size={15} />
                    <span>Xem thử (ĐT & PC)</span>
                  </button>

                  {item.tryUrl && (
                    <Link
                      href={item.tryUrl}
                      className="action-btn-try-photo"
                      aria-label={`Thử thay ảnh của bạn vào mẫu ${item.name}`}
                    >
                      <Camera size={14} />
                      <span>Thử thay ảnh của bạn</span>
                    </Link>
                  )}

                  <a
                    href={item.liveDemoUrl || `/thiep/${item.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn-live"
                    aria-label={`Mở thiệp ${item.name} trực tiếp`}
                  >
                    <ArrowUpRight size={15} />
                    <span>Mở mẫu thiệp</span>
                  </a>
                </div>

                <div className="overlay-features">
                  {item.hasMusic && <span title="Có nhạc nền">🎵 Nhạc nền</span>}
                  {item.hasRsvp && <span title="Xác nhận tham dự">💌 RSVP</span>}
                  {item.hasMap && <span title="Bản đồ chỉ đường">🗺️ Bản đồ</span>}
                </div>
              </div>
            </div>

            {/* Card Content & Metadata */}
            <div className="template-card-meta">
              <div className="card-top-row">
                <span className="card-category-tag">{item.categoryLabel}</span>
                {/* Color swatches */}
                <div className="card-swatches" aria-label={`Bảng màu: ${item.tone}`}>
                  {item.colors.map((c) => (
                    <span key={c} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <h3 className="template-title">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(item)}
                  aria-label={`Xem thử mẫu ${item.name}`}
                >
                  {item.name}
                </button>
              </h3>

              <p className="template-couple">
                <Heart size={12} className="heart-inline" /> {item.coupleName}
              </p>

              <p className="template-desc">{item.description}</p>
              {item.packageLabel && <p className="card-package-tag">{item.packageLabel}</p>}

              <div className="template-card-footer">
                <button
                  type="button"
                  className="card-quick-preview-link"
                  onClick={() => setSelectedPreview(item)}
                >
                  <Eye size={14} />
                  <span>Xem thử</span>
                </button>

                {item.tryUrl && (
                  <Link href={item.tryUrl} className="card-quick-try-btn">
                    <Camera size={13} />
                    <span>Thử thay ảnh</span>
                  </Link>
                )}

                <ConsultationButton
                  className="card-choose-btn"
                  templateName={item.name}
                  packageName={item.packageLabel}
                >
                  Liên hệ đặt mẫu
                </ConsultationButton>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Live Preview Modal (Simulating Mobile Phone & Desktop) */}
      <LivePreviewModal
        template={selectedPreview}
        onClose={() => setSelectedPreview(null)}
        onChoose={(template) => {
          setSelectedPreview(null);
          setSelectedConsultation(template);
        }}
      />
      {selectedConsultation && (
        <ConsultationDialog
          templateName={selectedConsultation.name}
          packageName={selectedConsultation.packageLabel}
          onClose={() => setSelectedConsultation(null)}
        />
      )}
    </section>
  );
}
