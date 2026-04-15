import type { Metadata } from 'next';
import ServicesPage from './ServicesPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'service' || r.template === 'services');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return buildPageMetadata({
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        canonical: data.seo.canonical_url || 'https://homespace.ge/services',
        keywords: data.seo.keywords,
        image: data.seo.og_image || data.seo.social_image || undefined,
      });
    }
  } catch { }
  return buildPageMetadata({
    title: 'სერვისები',
    description: 'ინტერიერის დიზაინი, ავეჯის დამზადება, განათების დაგეგმარება და რემონტი — HomeSpace.ge-ს სრული სერვისები.',
    canonical: 'https://homespace.ge/services',
    keywords: ['სერვისები', 'ინტერიერი', 'HomeSpace'],
  });
}

export default async function Page() {
  const locale = await getServerLocale();
  let posts;
  let pageTitle;
  let pageDescription;
  let blocks;
  try {
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'service' || r.template === 'services');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      posts = data.relations?.posts;
      pageTitle = data.page.title;
      pageDescription = data.page.description;
      blocks = data.page.blocks;
    }
  } catch (error) {
    console.error('Failed to fetch services page data:', error);
  }
  return <ServicesPage posts={posts} pageTitle={pageTitle} pageDescription={pageDescription} blocks={blocks} />;
}
