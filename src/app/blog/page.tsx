import type { Metadata } from 'next';
import BlogListPage from './BlogListPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'blog' || r.template === 'news');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return {
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        alternates: { canonical: data.seo.canonical_url || 'https://newhome.ge/blog' },
      };
    }
  } catch {}
  return {
    title: 'ბლოგი / სიახლეები',
    description: 'NewHome-ის ბლოგი — ინტერიერის სიახლეები და ტენდენციები.',
    alternates: { canonical: 'https://newhome.ge/blog' },
  };
}

export default async function Page() {
  const locale = await getServerLocale();
  let data = null;
  try {
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'blog' || r.template === 'news');
    if (route) {
      data = await api.getPage(route.slug, locale || undefined);
    }
  } catch (error) {
    console.error('Failed to fetch blog page data:', error);
  }
  return <BlogListPage data={data} />;
}
