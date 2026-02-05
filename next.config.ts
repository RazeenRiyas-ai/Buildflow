import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['react-map-gl'],
  // Triggering rebuild for new dependencies (react-map-gl)
};

export default nextConfig;
