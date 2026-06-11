import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  // Evita que la app se incruste en iframes de otros dominios (clickjacking)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Impide que el navegador adivine el tipo MIME (MIME sniffing)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Solo envía el origen en el Referer, sin path ni query string
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    // Autoriza imágenes remotas del CDN de UploadThing (formato: https://<app>.ufs.sh/f/<key>)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
