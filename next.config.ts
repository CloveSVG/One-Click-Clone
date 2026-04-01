import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'p1-kling.klingai.com',
      },
      {
        protocol: 'https',
        hostname: '*.klingai.com',
      },
    ],
  },
};

export default nextConfig;
