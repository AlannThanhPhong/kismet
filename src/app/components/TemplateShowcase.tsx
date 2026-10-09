"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Eye, Heart, Monitor, Music2, Smartphone, Sparkles } from "lucide-react";
import { WEDDING_TEMPLATES, type TemplateCategory, type WeddingTemplateItem } from "@/lib/templates-data";
import LivePreviewModal from "./LivePreviewModal";

const CATEGORIES: { key: TemplateCategory; label: string }[] = [
  { key: "all", label: "Tất cả mẫu thiệp" },
  { key: "vintage", label: "Hoài Niệm / Film" },
  { key: "modern", label: "Trong Trẻo / Minimal" },
];

export default function TemplateShowcase() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("all");
  const [selectedPreview, setSelectedPreview] = useState<WeddingTemplateItem | null>(null);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return WEDDING_TEMPLATES;
    return WEDDING_TEMPLATES.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="template-showcase-section section-wrap" id="kho-mau-thiep" aria-labelledby="catalog-title">
      {/* Section Header */}
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">01 / KHO GIAO DIỆN THIỆP CƯỚI ĐIỆN TỬ</p>
        <h2 id="catalog-title">
          Chọn phong cách riêng<br />
          <em>cho câu chuyện của hai bạn.</em>
        </h2>
        <p className="section-subheading">
          Hiện có 2 mẫu thiệp thực tế để bạn trải nghiệm. Mỗi chiếc thiệp được chăm chút tỉ mỉ từ màu sắc, phông chữ đến hiệu ứng chuyển động.
          Mẫu Kim Hiên & Văn Tài thuộc gói 800.000đ; mẫu Huyền Vy & Anh Minh thuộc gói Custom.
          Tương thích hoàn hảo trên mọi kích thước màn hình điện thoại, máy tính bảng và máy tính để bàn.
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

      {/* Filter Tabs */}
      <div className="category-filters-wrapper" data-reveal>
        <div className="category-filters" role="tablist" aria-label="Bộ lọc phong cách thiệp cưới">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.key}
              className={`filter-pill ${activeCategory === cat.key ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
              {cat.key === "all" ? (
                <span className="pill-count">{WEDDING_TEMPLATES.length}</span>
              ) : (
                <span className="pill-count">
                  {WEDDING_TEMPLATES.filter((t) => t.category === cat.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="templates-showcase-grid" data-reveal>
        {filteredTemplates.map((item, idx) => (
          <article className="template-card-item" key={item.id}>
            {/* Card Preview Window with cinelove-inspired hover pan */}
            <div className="template-card-preview">
              {/* Badge */}
              {item.badge && (
                <span className={`template-badge badge-${item.badgeType || "default"}`}>
                  {item.badge}
                </span>
              )}

              {/* Image Frame */}
              <div className="template-image-scroll-frame">
                <Image
                  src={item.coverImage}
                  alt={`Thiệp cưới ${item.name} - ${item.coupleName}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="template-scroll-image"
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
                    <Eye size={16} />
                    <span>Xem thử (ĐT & PC)</span>
                  </button>

                  <a
                    href={item.liveDemoUrl || `/thiep/${item.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn-live"
                    aria-label={`Mở thiệp ${item.name} trực tiếp`}
                  >
                    <ArrowUpRight size={16} />
                    <span>Xem thiệp thật</span>
                  </a>
                </div>

                <div className="overlay-features">
                  {item.hasMusic && <span title="Có nhạc nền">🎵 Nhạc nền</span>}
                  {item.hasRsvp && <span title="Xác nhận tham dự">💌 RSVP</span>}
                  {item.hasMap && <span title="Bản đồ chỉ đường">🗺️ Bản đồ</span>}
                </div>
              </div>

              {/* Quick index stamp */}
              <span className="template-card-num">{(idx + 1).toString().padStart(2, "0")}</span>
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
                <a
                  href={item.liveDemoUrl || `/thiep/${item.code}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPreview(item);
                  }}
                >
                  {item.name}
                </a>
              </h3>

              <p className="template-couple">
                <Heart size={12} className="heart-inline" /> {item.coupleName}
              </p>

              <p className="template-desc">{item.description}</p>
              <p className="card-category-tag">{item.packageLabel}</p>

              <div className="template-card-footer">
                <button
                  type="button"
                  className="card-quick-preview-link"
                  onClick={() => setSelectedPreview(item)}
                >
                  <span>Mô phỏng trải nghiệm</span>
                  <ArrowUpRight size={14} />
                </button>

                <a href="#bat-dau" className="card-choose-btn">
                  Đặt mẫu này
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Live Preview Modal (Simulating Mobile Phone & Desktop) */}
      <LivePreviewModal
        template={selectedPreview}
        onClose={() => setSelectedPreview(null)}
      />
    </section>
  );
}
