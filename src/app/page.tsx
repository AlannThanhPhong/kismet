import { currencyForCountry } from "@/lib/pricing";
import { getVisitorCountry } from "@/lib/visitor-country";
import type { Metadata } from "next";
import { BRAND_LOGO, SITE_URL } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/contact";
import WhiteStorefront from "./components/WhiteStorefront";
import "./white-storefront.css";
import "./pricing-white.css";
import "./project-previews.css";
import "./mood-white.css";
import "./home-background.css";

const title = "kIsmet love - Redefining invitations with E-wedding innovation";
const description = "Beyond traditional invites-bring your love story, cinematic film, and wedding album to life forever";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    images: [BRAND_LOGO],
    title,
    description,
    siteName: "kIsmet love",
    url: "/",
    type: "website",
    locale: "vi_VN",
  },
  twitter: { card: "summary", title, description, images: [BRAND_LOGO.url] },
};

export default async function Home() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "kIsmet love",
    alternateName: "KISMET LOVE",
    url: SITE_URL,
    inLanguage: "vi-VN",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "kIsmet love",
    alternateName: "KISMET LOVE",
    url: SITE_URL,
    email: CONTACT_EMAIL,
    logo: {
      "@type": "ImageObject",
      url: new URL(BRAND_LOGO.url, SITE_URL).href,
      width: BRAND_LOGO.width,
      height: BRAND_LOGO.height,
      caption: "kIsmet love",
    },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <WhiteStorefront currency={currencyForCountry(await getVisitorCountry())} />
  </>;
}
