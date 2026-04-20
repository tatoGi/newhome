import type { MetadataRoute } from 'next';
import { api } from '@/lib/api/client';

const BASE = 'https://homespace.ge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                      changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/products`,        changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/services`,        changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/projects`,        changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`,            changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,           changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,         changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,         changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,           changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // Products
  try {
    const data = await api.getProducts();
    for (const p of data.products ?? []) {
      dynamicRoutes.push({
        url: `${BASE}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch {}

  // Services and Projects via bootstrap routeMap
  try {
    const bootstrap = await api.getBootstrap();

    // Services
    const serviceRoute = bootstrap.routeMap.find((r) => r.template === 'service' || r.template === 'services');
    if (serviceRoute) {
      const serviceData = await api.getPage(serviceRoute.slug);
      for (const post of serviceData.relations?.posts ?? []) {
        dynamicRoutes.push({
          url: `${BASE}/service/${post.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }

    // Projects
    const projectRoute = bootstrap.routeMap.find((r) => r.template === 'project' || r.template === 'projects');
    if (projectRoute) {
      const projectData = await api.getPage(projectRoute.slug);
      for (const post of projectData.relations?.posts ?? []) {
        dynamicRoutes.push({
          url: `${BASE}/project/${post.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }

    // Blog posts
    const blogRoute = bootstrap.routeMap.find((r) => r.template === 'blog' || r.template === 'news');
    if (blogRoute) {
      const blogData = await api.getPage(blogRoute.slug);
      for (const post of blogData.relations?.posts ?? []) {
        dynamicRoutes.push({
          url: `${BASE}/blog/${post.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      }
    }

    // CMS pages
    for (const route of bootstrap.routeMap) {
      const skip = ['home', 'service', 'services', 'project', 'projects', 'blog', 'news', 'products', 'shop', 'contact', 'about'];
      if (!skip.includes(route.template) && route.slug) {
        dynamicRoutes.push({
          url: `${BASE}/${route.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    }
  } catch {}

  return [...staticRoutes, ...dynamicRoutes];
}
