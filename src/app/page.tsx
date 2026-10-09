import { currencyForCountry } from "@/lib/pricing";
import { getVisitorCountry } from "@/lib/visitor-country";
import type { Metadata } from "next";
import WhiteStorefront from "./components/WhiteStorefront";
import "./white-storefront.css";
import "./pricing-white.css";
import "./project-previews.css";
import "./mood-white.css";
import "./home-background.css";

const title = "kIsmet love — Thiệp cưới online theo cách của hai bạn";
const description = "Tạo thiệp cưới online thật riêng, gửi lời mời thật gần Thiết kế tinh tế, RSVP tiện lợi và lưu giữ khoảnh khắc của hai bạn cùng kIsmet love";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    siteName: "kIsmet love",
    url: "/",
    type: "website",
    locale: "vi_VN",
  },
  twitter: { card: "summary", title, description },
};

export default async function Home() {
  return <WhiteStorefront currency={currencyForCountry(await getVisitorCountry())} />;
}
