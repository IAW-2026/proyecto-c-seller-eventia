import type { MetadataRoute } from 'next';

// Solo la home es pública — /organizador y /admin están en robots.ts como disallow
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SELLER_BASE_URL!;
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
