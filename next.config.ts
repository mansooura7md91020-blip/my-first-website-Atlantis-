import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product images can come from the user-owned public Supabase storage bucket.
  images: { unoptimized: true },
};
export default nextConfig;
