import type { MetadataRoute } from 'next';

// Solo la home es pública — /organizador y /admin están en robots.ts como disallow
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
