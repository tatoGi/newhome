import type { Metadata } from 'next';
import ProjectsPage from './ProjectsPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'project' || r.template === 'projects');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return buildPageMetadata({
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        canonical: data.seo.canonical_url || 'https://homespace.ge/projects',
        keywords: data.seo.keywords || undefined,
        image: data.seo.og_image || data.seo.social_image || undefined,
      });
    }
  } catch { }
  return buildPageMetadata({
    title: 'პროექტები',
    description: 'HomeSpace-ის განხორციელებული ინტერიერის დიზაინის პროექტები — საცხოვრებელი და კომერციული სივრცეები.',
    canonical: 'https://homespace.ge/projects',
    keywords: ['პროექტები', 'ინტერიერი', 'HomeSpace'],
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
    const route = bootstrap.routeMap.find((r) => r.template === 'project' || r.template === 'projects');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      posts = data.relations?.posts;
      pageTitle = data.page.title;
      pageDescription = data.page.description;
      blocks = data.page.blocks;
    }
  } catch (error) {
    console.error('Failed to fetch projects page data:', error);
  }
  return <ProjectsPage posts={posts} pageTitle={pageTitle} pageDescription={pageDescription} blocks={blocks} />;
}
