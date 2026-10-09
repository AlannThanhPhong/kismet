import { Suspense } from "react";
import type { Metadata } from "next";
import WeddingCustomizerClient from "./WeddingCustomizerClient";
import "./customizer.css";

export const metadata: Metadata = {
  title: "Tạo & Chỉnh Sửa Thiệp Cưới Online | Thử Thay Ảnh & Điền Thông Tin Dâu Rể",
  description:
    "Trải nghiệm tự do điền thông tin dâu rể, thông tin gia đình hai bên, tiệc cưới, lễ cưới, hộp mừng VietQR và thay ảnh vào mẫu thiệp Gói 500k & 800k trước khi đặt dịch vụ tại kIsmet love",
};

export default function ThuThiepPage() {
  return (
    <div className="customizer-page-wrapper">
      <Suspense fallback={<div className="customizer-loading">Đang tải phòng tạo thiệp cưới</div>}>
        <WeddingCustomizerClient />
      </Suspense>
    </div>
  );
}
