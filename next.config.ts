import type { NextConfig } from "next";

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
};

export default nextConfig;
