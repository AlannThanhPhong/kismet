"use client";

import { Check, Heart, Sparkles, X } from "lucide-react";
import { packagePrice, type PricingCurrency } from "@/lib/pricing";

export default function ComparisonSection({ currency }: { currency: PricingCurrency }) {
  const comparisonRows = [
    {
      feature: "Chi phí thực hiện",
      online: `Chỉ từ ${packagePrice("standard", currency)} trọn gói, không phát sinh`,
      onlineGood: true,
      paper: "Tốn 2.000.000đ - 4.500.000đ in ấn",
      paperGood: false,
    },
    {
      feature: "Thời gian gửi thiệp",
      online: "1 chạm gửi ngay qua Messenger, SMS",
      onlineGood: true,
      paper: "Mất 1 - 2 tuần di chuyển đi gửi từng người",
      paperGood: false,
    },
    {
      feature: "Nắm bắt số khách (RSVP)",
      online: "Khách bấm xác nhận tức thì, chủ động số bàn",
      onlineGood: true,
      paper: "Khó nắm bắt, dễ thừa/thiếu cỗ tiệc cưới",
      paperGood: false,
    },
    {
      feature: "Chỉnh sửa khi đổi lịch",
      online: "Cập nhật ngày giờ, địa điểm tức thì trên link",
      onlineGood: true,
      paper: "Phải hủy toàn bộ và tốn tiền in lại",
      paperGood: false,
    },
    {
      feature: "Âm nhạc & Album ảnh",
      online: "Tự động phát bài hát tình yêu + 30 ảnh HD",
      onlineGood: true,
      paper: "Không có âm nhạc, chỉ in được 1 - 2 ảnh nhỏ",
      paperGood: false,
    },
    {
      feature: "Chỉ đường đến tiệc cưới",
      online: "Tích hợp Google Maps 1 chạm dẫn tận nơi",
      onlineGood: true,
      paper: "Bản đồ vẽ tay sơ sài, khách dễ bị lạc đường",
      paperGood: false,
    },
    {
      feature: "Mừng cưới cho bạn ở xa",
      online: "Mã VietQR & STK ngân hàng tinh tế, lịch sự",
      onlineGood: true,
      paper: "Khách ở xa khó gửi phong bì mừng cưới",
      paperGood: false,
    },
    {
      feature: "Giá trị kỷ niệm lâu dài",
      online: "Lưu giữ mãi mãi như website tình yêu riêng",
      onlineGood: true,
      paper: "Dễ thất lạc, ngả màu hoặc bị bỏ đi",
      paperGood: false,
    },
  ];

  return (
    <section className="comparison-table-section section-wrap" id="so-sanh" aria-labelledby="comp-title">
      <div className="section-header-centered" data-reveal>
        <p className="section-kicker">04 / BẢNG SO SÁNH TRỰC QUAN</p>
        <h2 id="comp-title">
          Tại sao hơn 90% dâu rể thế hệ mới<br />
          <em>lựa chọn thiệp cưới điện tử?</em>
        </h2>
        <p className="section-subheading">
          Sự kết hợp hoàn hảo giữa công nghệ tiện ích và sự chân thành, tinh tế trong từng lời mời gửi đến người thân yêu
        </p>
      </div>

      <div className="comparison-table-wrapper" data-reveal>
        <div className="table-responsive-container">
          <table className="comparison-custom-table">
            <thead>
              <tr>
                <th className="th-feature">Tiêu chí so sánh</th>
                <th className="th-online highlighted-th">
                  <span className="th-badge">HIỆN ĐẠI & TIỆN ÍCH</span>
                  <span className="th-name">Thiệp Cưới Online kIsmet</span>
                </th>
                <th className="th-paper">
                  <span className="th-paper-label">TRUYỀN THỐNG</span>
                  <span className="th-name">Thiệp Giấy In Thông Thường</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                  <td className="td-feature">
                    <strong>{row.feature}</strong>
                  </td>
                  <td className="td-online highlighted-td">
                    <span className="icon-status is-positive">
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                    <span>{row.online}</span>
                  </td>
                  <td className="td-paper">
                    <span className="icon-status is-negative">
                      <X size={15} strokeWidth={2} />
                    </span>
                    <span>{row.paper}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
