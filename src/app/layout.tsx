import type { Metadata, Viewport } from "next";
import { BRAND_LOGO, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "kIsmet love",
  icons: {
    icon: [{ url: BRAND_LOGO.url, type: "image/jpeg", sizes: "1254x1254" }],
    shortcut: BRAND_LOGO.url,
    apple: [{ url: BRAND_LOGO.url, sizes: "1254x1254", type: "image/jpeg" }],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  },
  title: "kIsmet love — Thiệp cưới điện tử & Website đám cưới 5.0",
  description:
    "Nền tảng tạo thiệp cưới online và website đám cưới tinh tế thời 5.0 Tích hợp nhạc nền tự động, album ảnh cưới HD, bản đồ Google Maps và xác nhận tham dự (RSVP) tức thì trên điện thoại và máy tính",
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
    images: [BRAND_LOGO],
    siteName: "kIsmet love",
    title: "kIsmet love — Thiệp cưới điện tử & Website đám cưới 5.0",
    description:
      "Gói câu chuyện của hai bạn vào một chiếc thiệp cưới online thông minh Âm nhạc, hình ảnh, bản đồ và lời thương trọn vẹn",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    images: [BRAND_LOGO.url],
    card: "summary",
    title: "kIsmet love — Thiệp cưới điện tử & Website đám cưới 5.0",
    description: "Gói câu chuyện của hai bạn vào một chiếc thiệp cưới online thông minh Âm nhạc, hình ảnh, bản đồ và lời thương trọn vẹn",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
