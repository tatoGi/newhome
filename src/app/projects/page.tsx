import type { Metadata } from 'next';
import ProjectsPage from './ProjectsPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'project' || r.template === 'projects');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return {
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        alternates: { canonical: data.seo.canonical_url || 'https://newhome.ge/projects' },
      };
    }
  } catch {}
  return {
    title: 'პროექტები',
    description: 'NewHome-ის განხორციელებული ინტერიერის დიზაინის პროექტები — საცხოვრებელი და კომერციული სივრცეები.',
    alternates: { canonical: 'https://newhome.ge/projects' },
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
