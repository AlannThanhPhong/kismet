"use client";

import { Check, Gift, Heart, Sparkles, Star } from "lucide-react";
import { packageAmount, packagePrice, type PricingCurrency } from "@/lib/pricing";

export default function PricingSection({ currency }: { currency: PricingCurrency }) {
  const packages = [
    {
      id: "standard",
      name: "GÓI TIÊU CHUẨN",
      subtitle: "Gói Thương",
      price: packageAmount("standard", currency),
      sampleLabel: "Mẫu thiệp sẽ bổ sung sau",
      sampleUrl: null,
      period: "đ / trọn gói",
      badge: null,
      isPopular: false,
      description: "Phù hợp cho đám cưới đơn giản, đầy đủ các tính năng cơ bản cần thiết.",
      features: [
        "Lưu trữ thiệp online trong 06 tháng",
        "01 Địa điểm & Bản đồ Google Maps",
        "01 Mã VietQR & Hộp mừng cưới trang trọng",
        "Album ảnh cưới tối đa 10 ảnh chất lượng cao",
        "Chọn nhạc nền lãng mạn từ kho tuyển chọn",
        "Form RSVP nhận xác nhận tham dự",
        "Hỗ trợ chỉnh sửa thông tin 02 lần",
      ],
      notIncluded: [
        "Lưu trữ trọn đời",
        "Tích hợp Video cưới",
        "Link mời đích danh từng khách",
        "Tặng thiết kế Logo Monogram riêng",
      ],
      ctaText: "Chọn gói Tiêu Chuẩn",
    },
    {
      id: "premium",
      name: "GÓI NÂNG CAO",
      subtitle: "Gói Chung Đôi",
      price: packageAmount("premium", currency),
      sampleLabel: "Xem mẫu Kim Hiên & Văn Tài",
      sampleUrl: "/thiep/20261027-KHVT",
      period: "đ / trọn gói",
      badge: "GÓI NÂNG CAO",
      isPopular: true,
      description: "Trải nghiệm hoàn hảo nhất cho ngày cưới với đầy đủ tiện ích và lưu giữ trọn đời.",
      features: [
        "✨ LƯU TRỮ VĨNH VIỄN TRỌN ĐỜI",
        "Tích hợp đầy đủ 2 bên Nhà Trai & Nhà Gái (2 bản đồ)",
        "02 Tài khoản mừng cưới & Mã VietQR riêng biệt",
        "Album 30 ảnh HD sắc nét + Tích hợp Video cưới",
        "Tùy chọn bài hát nhạc nền bất kỳ theo sở thích",
        "RSVP thông minh + Bảng tổng hợp lời chúc real-time",
        "Tạo link mời đích danh từng khách không giới hạn",
        "🎁 TẶNG THIẾT KẾ LOGO TÊN DÂU & RỂ RIÊNG",
        "Chỉnh sửa không giới hạn đến ngày cưới",
      ],
      notIncluded: [],
      ctaText: "Chọn gói Chung Đôi",
    },
    {
      id: "bespoke",
      name: "GÓI MAY ĐO ĐỘC BẢN",
      subtitle: "Gói Vĩnh Cửu",
      price: packageAmount("bespoke", currency),
      sampleLabel: "Mẫu thiệp sẽ bổ sung sau",
      sampleUrl: null,
      period: "đ / trọn gói",
      badge: "THIẾT KẾ RIÊNG 1-1",
      isPopular: false,
      description: "Dành cho các cặp đôi muốn một chiếc thiệp độc nhất vô nhị theo câu chuyện tình yêu.",
      features: [
        "Toàn bộ đặc quyền của Gói Chung Đôi",
        "LƯU TRỮ VĨNH VIỄN TRỌN ĐỜI",
        "Designer thiết kế giao diện độc quyền theo yêu cầu 1-1",
        "Tùy biến tone màu, layout & font chữ riêng biệt",
        "Hiệu ứng đặc biệt (Hạt phim, cánh hoa rơi, pháo hoa)",
        "Hỗ trợ gắn Tên Miền Riêng (domain cá nhân)",
        "Ưu tiên hoàn thiện siêu tốc trong 12 giờ",
        "Chăm sóc riêng 24/7 suốt mùa cưới",
      ],
      notIncluded: [],
      ctaText: "Tư vấn gói May Đo Độc Bản",
    },
    {
      id: "custom",
      name: "GÓI CUSTOM",
      subtitle: "Theo nhu cầu của bạn",
      price: "Liên hệ",
      sampleLabel: "Xem mẫu Huyền Vy & Anh Minh",
      sampleUrl: "/thiep/20260110-NHVVAM",
      period: "Báo giá theo yêu cầu",
      badge: null,
      isPopular: false,
      description: "Thiết kế và tính năng được tư vấn riêng theo nhu cầu, phong cách và ngân sách của khách hàng.",
      features: [
        "Tư vấn ý tưởng và phong cách thiệp riêng",
        "Tùy chỉnh giao diện theo yêu cầu",
        "Thống nhất tính năng và nội dung cần có",
        "Báo giá theo phạm vi thực hiện",
      ],
      notIncluded: [],
      ctaText: "Tư vấn gói Custom",
    },
  ];

  return (
    <section className="pricing-section section-wrap" id="bang-gia" aria-labelledby="pricing-title">
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">05 / CHI PHÍ MINH BẠCH & HỢP LÝ</p>
        <h2 id="pricing-title">
          Bảng giá dịch vụ thiệp cưới online<br />
          <em>đầu tư nhỏ cho kỷ niệm lớn.</em>
        </h2>
        <p className="section-subheading">
          Ba gói trọn gói {packagePrice("standard", currency)}, {packagePrice("premium", currency)}, {packagePrice("bespoke", currency)} và gói Custom theo nhu cầu.
          Chọn gói phù hợp để lưu giữ khoảnh khắc của hai bạn.
        </p>
      </div>

      <div className="pricing-cards-grid" data-reveal>
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            className={`pricing-card-item ${pkg.isPopular ? "is-popular-card" : ""}`}
          >
            {pkg.badge && (
              <div className="pricing-top-ribbon">
                <Star size={13} fill="currentColor" />
                <span>{pkg.badge}</span>
              </div>
            )}

            <div className="pricing-card-header">
              <span className="pkg-subtitle">{pkg.subtitle}</span>
              <h3 className="pkg-name">{pkg.name}</h3>
              <p className="pkg-desc">{pkg.description}</p>
              {pkg.sampleUrl ? (
                <a className="text-link" href={pkg.sampleUrl} target="_blank" rel="noopener noreferrer">
                  {pkg.sampleLabel} ↗
                </a>
              ) : (
                <p className="price-note">{pkg.sampleLabel}</p>
              )}
            </div>

            <div className="pricing-card-price">
              <div className="price-main">
                {pkg.id !== "custom" && currency === "USD" && <span className="price-currency">$</span>}
                <span className="price-amount">{pkg.price}</span>
                {pkg.id !== "custom" && <span className="price-unit">{currency === "VND" ? "đ" : "USD"}</span>}
              </div>
              <span className="price-note">{pkg.id === "custom" ? pkg.period : "Giá trọn gói"}</span>
            </div>

            <div className="pricing-card-body">
              <p className="features-list-title">Đặc quyền bao gồm:</p>
              <ul className="pkg-features-list">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="feat-available">
                    <Check size={16} className="feat-check" />
                    <span>{feat}</span>
                  </li>
                ))}
                {pkg.notIncluded.map((feat, i) => (
                  <li key={i} className="feat-unavailable">
                    <span className="feat-dash">—</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing-card-cta">
              <a
                href="#bat-dau"
                className={`button ${pkg.isPopular ? "button-wine btn-glow" : "button-outline"}`}
              >
                {pkg.ctaText} ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Gift commitment bar */}
      <div className="pricing-commit-box" data-reveal>
        <div className="commit-item">
          <Gift size={20} className="commit-icon" />
          <div>
            <strong>Quà tặng mùa cưới</strong>
            <p>Tặng kèm thiết kế Monogram Logo tên Dâu Rể{currency === "VND" ? " trị giá 200.000đ" : ""} khi đặt thiệp hôm nay.</p>
          </div>
        </div>
        <div className="commit-item">
          <Sparkles size={20} className="commit-icon" />
          <div>
            <strong>Chỉnh sửa tận tâm</strong>
            <p>Hỗ trợ chỉnh sửa đến khi hai bạn hoàn toàn hài lòng trước khi gửi link chính thức.</p>
          </div>
        </div>
        <div className="commit-item">
          <Heart size={20} className="commit-icon" />
          <div>
            <strong>Bảo mật thông tin</strong>
            <p>Bảo mật tuyệt đối hình ảnh, số điện thoại và thông tin cá nhân của Dâu Rể.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
