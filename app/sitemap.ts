import type { MetadataRoute } from 'next';
import { hotels } from '@/data/hotels';
import { site } from '@/data/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['/', '/hotels/', '/banquets-events/', '/gallery/', '/about/', '/contact/'];
  return [
    ...pages.map((p) => ({ url: site.url + p, lastModified: now, changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : 0.7 })),
    ...hotels.map((h) => ({
      url: `${site.url}/hotels/${h.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: h.content === 'placeholder' ? 0.4 : 0.9,
    })),
  ];
}
