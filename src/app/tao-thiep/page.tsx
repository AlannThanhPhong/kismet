import { Suspense } from "react";
import type { Metadata } from "next";
import WeddingCustomizerClient from "../thu-thiep/WeddingCustomizerClient";
import "../thu-thiep/customizer.css";

export const metadata: Metadata = {
  title: "Tạo Thiệp Cưới Online 5.0 | Điền Thông Tin Dâu Rể & Thử Mẫu 500k & 800k",
  description:
    "Tạo thiệp cưới điện tử thông minh: điền lời mở đầu, họ tên, thông tin gia đình 2 bên, lễ cưới, tiệc cưới, hộp mừng VietQR và thay ảnh thử nghiệm.",
};

export default function TaoThiepPage() {
  return (
    <div className="customizer-page-wrapper">
      <Suspense fallback={<div className="customizer-loading">Đang tải phòng tạo thiệp cưới...</div>}>
        <WeddingCustomizerClient />
      </Suspense>
    </div>
  );
}
