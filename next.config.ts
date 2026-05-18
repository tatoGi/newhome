import type { NextConfig } from 'next';
import path from 'path';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/web';
const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') ||
  apiBaseUrl.replace(/\/api\/web\/?$/, '');

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    dangerouslyAllowLocalIP: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 414, 640, 768, 1024, 1200, 1366],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/**' },
    ],
    qualities: [60, 70, 75, 80, 85],
  },
  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: `${backendBaseUrl}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
