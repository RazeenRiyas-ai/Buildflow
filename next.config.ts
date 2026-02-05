import type { NextConfig } from "next";

const nextConfig: any = {
  /* config options here */
  transpilePackages: ['react-map-gl'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
