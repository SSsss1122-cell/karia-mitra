import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Netlify to serve dynamic routes correctly
  output: "standalone",

  // Keep strict mode ON (recommended)
  reactStrictMode: true,

  // Allow image optimization for external sources
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "tkdegywzonhbzdjfxosq.supabase.co", // ✅ add your Supabase storage domain
    ],
  },

  // Optional: improve performance during build
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
