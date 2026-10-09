"use client";

import { Check, Gift, Heart, Sparkles, Star } from "lucide-react";
import { packageAmount, packagePrice, type PricingCurrency } from "@/lib/pricing";
import ConsultationButton from "./ConsultationButton";

export default function PricingSection({ currency }: { currency: PricingCurrency }) {
  const packages = [
    {
      id: "standard",
      name: "Basic",
      subtitle: "Gói Thương",
      price: packageAmount("standard", currency),
      sampleLabel: "Xem mẫu Basic & Thử ảnh",
      sampleUrl: "/thu-thiep?package=standard",
      period: "đ / trọn gói",
      badge: "BASIC",
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
      ctaText: "Chọn gói Basic",
    },
    {
      id: "premium",
      name: "Standard",
      subtitle: "Gói Chung Đôi (Mẫu KHVT)",
      price: packageAmount("premium", currency),
      sampleLabel: "Xem mẫu Kim Hiên & Văn Tài",
      sampleUrl: "/thiep/20261027-KHVT",
      period: "đ / trọn gói",
      badge: "PHỔ BIẾN NHẤT",
      isPopular: true,
      description: "Trải nghiệm hoàn hảo nhất cho ngày cưới với đầy đủ tiện ích và lưu giữ trong 2 năm.",
      features: [
        "Lưu trữ thiệp online trong 2 năm",
        "Tích hợp đầy đủ 2 bên Nhà Trai & Nhà Gái (2 bản đồ)",
        "02 Tài khoản mừng cưới & Mã VietQR riêng biệt",
        "Album 30 ảnh HD sắc nét + Tích hợp Video cưới",
        "Tùy chọn bài hát nhạc nền bất kỳ theo sở thích",
        "Tổng hợp RSVP & lời chúc, gửi lại 2 lần: trước ngày cưới 7 ngày và 2 ngày",
        "🎁 TẶNG THIẾT KẾ LOGO TÊN DÂU & RỂ RIÊNG",
        "Chỉnh sửa không giới hạn đến ngày cưới",
      ],
      ctaText: "Chọn gói Standard",
    },
    {
      id: "bespoke",
      name: "Premium",
      subtitle: "Gói Vĩnh Cửu",
      price: packageAmount("bespoke", currency),
      sampleLabel: "Liên hệ studio để xem mẫu Premium",
      sampleUrl: null,
      period: "đ / trọn gói",
      badge: "ĐỘC BẢN",
      isPopular: false,
      description: "Dành cho các cặp đôi muốn một chiếc thiệp độc nhất vô nhị theo câu chuyện tình yêu riêng.",
      features: [
        "Toàn bộ đặc quyền của gói Standard",
        "LƯU TRỮ VĨNH VIỄN TRỌN ĐỜI",
        "RSVP thông minh + Bảng tổng hợp lời chúc real-time",
        "Designer thiết kế giao diện độc quyền theo yêu cầu 1-1",
        "Tùy biến tone màu, layout & font chữ riêng biệt",
        "Hiệu ứng đặc biệt (Hạt phim, hoạt họa intro, pháo hoa)",
        "Ưu tiên hoàn thiện siêu tốc trong 12 giờ",
        "Chăm sóc riêng 24/7 suốt mùa cưới",
      ],
      ctaText: "Tư vấn gói Premium",
    },
    {
      id: "custom",
      name: "Customized",
      subtitle: "Theo nhu cầu của bạn",
      price: "Liên hệ",
      sampleLabel: "Xem dự án Huyền Vy & Anh Minh",
      sampleUrl: "/thiep/20260110-NHVVAM",
      period: "Báo giá theo yêu cầu",
      badge: null,
      isPopular: false,
      description: "Thiết kế và tính năng được tư vấn riêng theo nhu cầu, phong cách và ngân sách của hai bạn.",
      features: [
        "Tư vấn ý tưởng và phong cách thiệp riêng",
        "Tùy chỉnh giao diện theo yêu cầu",
        "Thống nhất tính năng và nội dung cần có",
        "Báo giá theo phạm vi thực hiện",
      ],
      ctaText: "Tư vấn gói Customized",
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
          Basic {packagePrice("standard", currency)}, Standard {packagePrice("premium", currency)}, Premium {packagePrice("bespoke", currency)} và Customized báo giá theo nhu cầu.
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
              </ul>
            </div>

            <div className="pricing-card-cta">
              <ConsultationButton
                packageName={pkg.name}
                className={`button ${pkg.isPopular ? "button-wine btn-glow" : "button-outline"}`}
              >
                {pkg.ctaText} ↗
              </ConsultationButton>
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
