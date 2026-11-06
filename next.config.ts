import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // For smooth Three.js canvas management
  turbopack: {},
  // Allow media assets
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
