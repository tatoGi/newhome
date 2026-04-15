import type { MetadataRoute } from 'next';
import { getAllProducts, getAllServices, getAllProjects } from '@/lib/data';

const BASE = 'https://newhome.ge';

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts().map(p => ({
    url: `${BASE}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const services = getAllServices().map(s => ({
    url: `${BASE}/service/${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const projects = getAllProjects().map(p => ({
    url: `${BASE}/project/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: BASE,                    changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/products`,      changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/services`,      changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/projects`,      changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,         changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,       changeFrequency: 'monthly', priority: 0.6 },
    ...products,
    ...services,
    ...projects,
  ];
}
