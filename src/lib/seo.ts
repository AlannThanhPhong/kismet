// Keep canonical URLs, sitemap URLs and structured data on the same host.
export const SITE_URL = "https://www.kismet-love.com";

export const BRAND_LOGO = {
  url: "/brand/kismet-love-logo.jpg",
  width: 1254,
  height: 1254,
  alt: "Logo kIsmet love – chữ K đỏ trên nền kem",
};

// Public service pages; couple invitations are added separately by sitemap.ts.
export const INDEXABLE_PATHS = ["/", "/tao-thiep"] as const;
