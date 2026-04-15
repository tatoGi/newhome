import type { Metadata } from 'next';
import AboutPage from './AboutPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'about');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return buildPageMetadata({
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        canonical: data.seo.canonical_url || 'https://homespace.ge/about',
        keywords: data.seo.keywords,
        image: data.seo.og_image || data.seo.social_image || undefined,
      });
    }
  } catch { }
  return buildPageMetadata({
    title: 'ჩვენს შესახებ',
    description: 'HomeSpace — 2015 წლიდან ვეხმარებით ადამიანებს საოცნებო სახლის მოწყობაში.',
    canonical: 'https://homespace.ge/about',
    keywords: ['HomeSpace', 'ავეჯი', 'ინტერიერი', 'ხარისხი'],
  });
}

export default async function Page() {
  const locale = await getServerLocale();
  let data = null;
  try {
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'about');
    if (route) {
      data = await api.getPage(route.slug, locale || undefined);
    }
  } catch (error) {
    console.error('Failed to fetch about page data:', error);
  }
  return <AboutPage data={data} />;
}
