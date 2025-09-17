import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
};

export default nextConfig;
