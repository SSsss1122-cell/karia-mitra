import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ✅ builds static site into /out
  reactStrictMode: true,
  images: {
    unoptimized: true, // ✅ required for static export (no Image Optimization server)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tkdegywzonhbzdjfxosq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
