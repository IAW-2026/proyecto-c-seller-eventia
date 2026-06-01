import type { MetadataRoute } from 'next';

// Le dice a Google qué puede indexar y qué no
// /organizador y /admin son privadas — no deben aparecer en búsquedas
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/organizador/', '/admin/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
