import type { Metadata } from 'next';
import AboutPage from './AboutPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'about');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return {
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        alternates: { canonical: data.seo.canonical_url || 'https://newhome.ge/about' },
      };
    }
  } catch {}
  return {
    title: 'ჩვენს შესახებ',
    description: 'NewHome — 2015 წლიდან ვეხმარებით ადამიანებს საოცნებო სახლის მოწყობაში.',
    alternates: { canonical: 'https://newhome.ge/about' },
  };
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
