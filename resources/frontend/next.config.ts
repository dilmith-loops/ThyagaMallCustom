import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ThyagaMall',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
