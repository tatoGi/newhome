import type { NextConfig } from 'next';
import path from 'path';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/web';
const backendBaseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '') ||
  apiBaseUrl.replace(/\/api\/web\/?$/, '');

function resolveBackendOrigin(): string {
  if (!backendBaseUrl) {
    return '';
  }

  try {
    return new URL(backendBaseUrl).origin;
  } catch {
    return '';
  }
}

function buildSecurityHeaders(): { key: string; value: string }[] {
  const backendOrigin = resolveBackendOrigin();

  const connectSrc = [
    "'self'",
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googletagmanager.com',
    'https://*.facebook.com',
    'https://vitals.vercel-insights.com',
    'https://va.vercel-scripts.com',
    backendOrigin,
  ].filter(Boolean).join(' ');

  const imgSrc = ["'self'", 'data:', 'blob:', 'https:', backendOrigin].filter(Boolean).join(' ');
  const mediaSrc = ["'self'", 'blob:', 'https://cms.homespace.ge', backendOrigin].filter(Boolean).join(' ');

  const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    `media-src ${mediaSrc}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-src 'self' https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');

  return [
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  ];
}

const securityHeaders = buildSecurityHeaders();

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
        source: '/:path*',
        headers: securityHeaders,
      },
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
