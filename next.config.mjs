/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Service Worker başlıkları
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        // Web App Manifest başlıkları
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json; charset=utf-8',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
      {
        // Tüm sayfalara PWA ile ilgili güvenlik başlıkları ekle
        source: '/(.*)',
        headers: [
          {
            // PWA kurulumunu zorlamak için referrer policy
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
