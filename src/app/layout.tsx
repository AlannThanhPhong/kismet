import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "kIsmet love — Thiệp cưới & những chuyện tình",
  description:
    "Gói câu chuyện của hai bạn vào một chiếc thiệp cưới online. Khám phá những lời mời, hình ảnh và giai điệu dành riêng cho ngày mình chung đôi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
