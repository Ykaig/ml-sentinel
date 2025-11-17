// dashboard/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable the standalone output mode for optimal Docker images
  output: 'standalone',
};

export default nextConfig;