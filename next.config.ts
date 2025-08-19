import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: false,
  images: {
    domains: ['cdn.myanimelist.net'],
  },
};

export default nextConfig;
