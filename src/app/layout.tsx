import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mơ — Thiệp cưới online, theo cách của hai bạn",
  description:
    "Tạo thiệp cưới online thật riêng, gửi lời mời thật gần. Thiết kế tinh tế, RSVP tiện lợi và lưu giữ khoảnh khắc của hai bạn.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
