import type { Metadata } from 'next';
import ServicesPage from './ServicesPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'service' || r.template === 'services');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return {
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        alternates: { canonical: data.seo.canonical_url || 'https://newhome.ge/services' },
      };
    }
  } catch {}
  return {
    title: 'სერვისები',
    description: 'ინტერიერის დიზაინი, ავეჯის დამზადება, განათების დაგეგმარება და რემონტი — NewHome.ge-ს სრული სერვისები.',
    alternates: { canonical: 'https://newhome.ge/services' },
  };
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
