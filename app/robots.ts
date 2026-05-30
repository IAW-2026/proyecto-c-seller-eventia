import type { MetadataRoute } from 'next';

// Le dice a Google qué puede indexar y qué no
// /vendedor y /admin son privadas — no deben aparecer en búsquedas
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/vendedor/', '/admin/'],
      },
    ],
  };
}
