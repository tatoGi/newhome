import type { Metadata } from 'next';
import BlogListPage from './BlogListPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { getServerFallbackLogo } from '@/lib/api/serverFallback';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'blog' || r.template === 'news');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      const fallbackLogo = await getServerFallbackLogo(locale || undefined);
      return buildPageMetadata({
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        canonical: data.seo.canonical_url || 'https://homespace.ge/blog',
        keywords: data.seo.keywords || undefined,
        image: data.seo.og_image || data.seo.social_image || fallbackLogo,
      });
    }
  } catch { }
  return buildPageMetadata({
    title: 'ბლოგი / სიახლეები',
    description: 'HomeSpace-ის ბლოგი — ინტერიერის სიახლეები და ტენდენციები.',
    canonical: 'https://homespace.ge/blog',
    keywords: ['ბლოგი', 'HomeSpace', 'ინტერიერი', 'სიახლეები'],
  });
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
