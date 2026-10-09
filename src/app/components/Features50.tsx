"use client";

import {
  Calendar,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Image as ImageIcon,
  MapPin,
  MessageSquareHeart,
  Music2,
  QrCode,
  Sparkles,
  UserCheck,
} from "lucide-react";

const FEATURES_LIST = [
  {
    icon: Music2,
    badge: "LÃNG MẠN",
    number: "01",
    title: "Âm Nhạc Du Dương Tự Động",
    description:
      "Tự động phát bài hát kỷ niệm của hai bạn khi khách mở thiệp. Tích hợp nút tạm dừng/bật nhạc tinh tế, tạo bầu không khí ngập tràn hạnh phúc.",
    tag: "Tự động phát · Tùy chọn bài hát",
  },
  {
    icon: UserCheck,
    badge: "TIỆN ÍCH",
    number: "02",
    title: "Xác Nhận Tham Dự (RSVP)",
    description:
      "Khách mời xác nhận số người tham dự, chế độ ăn và gửi lời nhắn chỉ với vài thao tác. Giúp Dâu Rể ước tính chính xác số lượng bàn tiệc, tránh lãng phí.",
    tag: "Thống kê tự động · Không lo thừa bàn",
  },
  {
    icon: MapPin,
    badge: "CHÍNH XÁC",
    number: "03",
    title: "Bản Đồ Google Maps 1 Chạm",
    description:
      "Dẫn đường chuẩn xác từng mét đến tư gia nhà trai, nhà gái hoặc trung tâm tiệc cưới. Khách chỉ cần chạm để mở ứng dụng Google Maps hoặc gọi xe.",
    tag: "Chỉ đường 1 chạm · Tích hợp 2 nhà",
  },
  {
    icon: QrCode,
    badge: "TẾ NHỊ",
    number: "04",
    title: "Hộp Mừng Cưới & Mã VietQR",
    description:
      "Hiển thị số tài khoản ngân hàng và mã VietQR được thiết kế trang nhã, kèm mã QR Momo. Thuận tiện và tinh tế cho những người bạn ở xa không thể đến dự.",
    tag: "Quét mã chuyển khoản · Bảo mật an toàn",
  },
  {
    icon: ImageIcon,
    badge: "SẮC NÉT",
    number: "05",
    title: "Album Ảnh Cưới HD & Video",
    description:
      "Lưu giữ và trình chiếu bộ ảnh cưới chất lượng cao không giới hạn. Vuốt chuyển ảnh mượt mà trên điện thoại, phóng to xem chi tiết trên máy tính.",
    tag: "Ảnh độ phân giải cao · Video Chibi/Pre-wedding",
  },
  {
    icon: Clock,
    badge: "HỒI HỘP",
    number: "06",
    title: "Đồng Hồ Đếm Ngược & Thêm Lịch",
    description:
      "Đếm ngược từng ngày, giờ, phút đến thời khắc hai bạn về chung một nhà. Tích hợp nút thêm lịch vào điện thoại nhắc nhở khách mời không quên ngày vui.",
    tag: "Đếm ngược thời gian thực · Lưu Google Calendar",
  },
  {
    icon: Sparkles,
    badge: "TRÂN TRỌNG",
    number: "07",
    title: "Cá Nhân Hóa Tên Từng Khách",
    description:
      "Tạo đường link thiệp riêng kèm tên từng vị khách: 'Thân mời Anh Minh', 'Kính mời Gia đình Bác Hải'. Tăng thêm sự trang trọng và thành ý trọn vẹn.",
    tag: "Link mời đích danh · Không giới hạn số lượng",
  },
  {
    icon: MessageSquareHeart,
    badge: "ẤM ÁP",
    number: "08",
    title: "Sổ Lưu Bút & Lời Chúc Phúc",
    description:
      "Nơi bạn bè, người thân để lại những dòng chúc phúc yêu thương nhất. Toàn bộ lời nhắn được lưu trữ mãi mãi như một cuốn nhật ký ngày cưới quý giá.",
    tag: "Lời chúc trực tuyến · Lưu niệm trọn đời",
  },
];

export default function Features50() {
  return (
    <section className="features-section section-wrap" id="tinh-nang-50" aria-labelledby="features-title">
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">02 / TRẢI NGHIỆM CÔNG NGHỆ CƯỚI 5.0</p>
        <h2 id="features-title">
          Không chỉ là chiếc thiệp.<br />
          <em>Là cả một thế giới kỷ niệm.</em>
        </h2>
        <p className="section-subheading">
          Khác biệt hoàn toàn với thiệp giấy truyền thống chỉ xem một chiều, thiệp cưới điện tử kIsmet love
          mang đến trải nghiệm tương tác sinh động, tiện lợi và đong đầy cảm xúc.
        </p>
      </div>

      <div className="features-grid-wrapper" data-reveal>
        {FEATURES_LIST.map((feat) => {
          const Icon = feat.icon;
          return (
            <article className="feature-modern-card" key={feat.number}>
              <div className="feature-card-header">
                <span className="feature-icon-wrapper">
                  <Icon size={24} strokeWidth={1.4} />
                </span>
                <span className="feature-number">{feat.number}</span>
              </div>

              <div className="feature-card-content">
                <span className="feature-pill-badge">{feat.badge}</span>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.description}</p>
              </div>

              <div className="feature-card-footer">
                <span className="feature-tag-pill">
                  <CheckCircle2 size={12} className="tag-check-icon" />
                  {feat.tag}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Visual interactive banner */}
      <div className="features-highlight-banner" data-reveal>
        <div className="banner-text">
          <span className="banner-kicker">TIỆN ÍCH DÀNH CHO DÂU RỂ HIỆN ĐẠI</span>
          <h3>Dễ dàng chia sẻ qua Messenger, Facebook & Tin nhắn SMS</h3>
          <p>
            Chỉ với một đường link duy nhất, bạn có thể gửi lời mời đến hàng trăm bạn bè, người thân ở xa
            hoặc đang sinh sống tại nước ngoài ngay tức thì.
          </p>
        </div>
        <div className="banner-cta">
          <a href="#kho-mau-thiep" className="button button-wine">
            Khám phá các mẫu thiệp 5.0 ↗
          </a>
        </div>
      </div>
    </section>
  );
}
