import { Suspense } from "react";
import type { Metadata } from "next";
import WeddingCustomizerClient from "../thu-thiep/WeddingCustomizerClient";
import "../thu-thiep/customizer.css";

export const metadata: Metadata = {
  title: "Tạo thiệp cưới online, thử mẫu và thay ảnh | kIsmet love",
  description:
    "Tạo thiệp cưới điện tử thông minh: điền lời mở đầu, họ tên, thông tin gia đình 2 bên, lễ cưới, tiệc cưới, hộp mừng VietQR và thay ảnh thử nghiệm",
  alternates: { canonical: "/tao-thiep" },
  openGraph: {
    title: "Tạo thiệp cưới online | kIsmet love",
    description: "Thử mẫu thiệp, thay ảnh và điền thông tin ngày cưới của hai bạn.",
    url: "/tao-thiep",
    siteName: "kIsmet love",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "Tạo thiệp cưới online | kIsmet love",
    description: "Thử mẫu thiệp, thay ảnh và điền thông tin ngày cưới của hai bạn.",
  },
};

export default function TaoThiepPage() {
  return (
    <div className="customizer-page-wrapper">
      <Suspense fallback={<div className="customizer-loading">Đang tải phòng tạo thiệp cưới</div>}>
        <WeddingCustomizerClient />
      </Suspense>
    </div>
  );
}
