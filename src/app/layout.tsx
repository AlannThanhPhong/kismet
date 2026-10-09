import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kismet-love.com"),
  title: "kIsmet love — Thiệp cưới điện tử & Website đám cưới 5.0",
  description:
    "Nền tảng tạo thiệp cưới online và website đám cưới tinh tế thời 5.0. Tích hợp nhạc nền tự động, album ảnh cưới HD, bản đồ Google Maps và xác nhận tham dự (RSVP) tức thì trên điện thoại và máy tính.",
  keywords: [
    "thiệp cưới online",
    "thiệp cưới điện tử",
    "website đám cưới",
    "thiệp cưới kismet",
    "thiệp cưới có nhạc",
    "thiệp cưới rsvp",
    "mẫu thiệp cưới đẹp",
  ],
  openGraph: {
    siteName: "kIsmet love",
    title: "kIsmet love — Thiệp cưới điện tử & Website đám cưới 5.0",
    description:
      "Gói câu chuyện của hai bạn vào một chiếc thiệp cưới online thông minh. Âm nhạc, hình ảnh, bản đồ và lời thương trọn vẹn.",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "kIsmet love — Thiệp cưới điện tử & Website đám cưới 5.0",
    description: "Gói câu chuyện của hai bạn vào một chiếc thiệp cưới online thông minh. Âm nhạc, hình ảnh, bản đồ và lời thương trọn vẹn.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
