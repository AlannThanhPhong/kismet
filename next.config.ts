import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production artifacts separate from a concurrently running dev server.
  distDir: process.env.KISMET_BUILD_DIR || (process.env.NODE_ENV === "development" ? ".next" : ".next-white"),
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
