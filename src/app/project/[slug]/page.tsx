import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api/client';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { getServerFallbackLogo } from '@/lib/api/serverFallback';
import ProjectDetailsPage from './ProjectDetailsPage';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateStaticParams() {
  try {
    const bootstrap = await api.getBootstrap();
    const route = bootstrap.routeMap.find((r) => r.template === 'project' || r.template === 'projects');
    if (!route) return [];
    const data = await api.getPage(route.slug);
    return (data.relations?.posts ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { locale: queryLocale } = await searchParams;
    const locale = queryLocale || await getServerLocale() || undefined;
    const data = await api.getProject(slug, locale);
    const intro = data.post.blocks?.find((b: any) => b.type === 'post_intro');
    const title = intro?.data?.title || data.post.title;
    const fallbackLogo = await getServerFallbackLogo(locale);
    const image = resolveImageOrFallback(intro?.data?.post_image || data.post.feature_image || '', fallbackLogo);
    return buildPageMetadata({
      title: data.seo?.meta_title || title,
      description: data.seo?.meta_description || data.post.excerpt || undefined,
      canonical: data.seo?.canonical_url || `https://homespace.ge/project/${slug}`,
      keywords: data.seo?.keywords || undefined,
      image: image || undefined,
    });
  } catch {
    return buildPageMetadata({
      title: 'პროექტი',
      description: 'HomeSpace პროექტი',
      canonical: 'https://homespace.ge/project',
      keywords: ['პროექტი', 'HomeSpace'],
    });
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { locale: queryLocale } = await searchParams;
  const locale = queryLocale || await getServerLocale() || undefined;

  let data;
  try {
    data = await api.getProject(slug, locale);
  } catch {
    notFound();
  }

  if (!data?.post) notFound();

  const project = {
    id: data.post.id,
    slug: data.post.slug ?? slug,
    title: data.post.title,
    desc: data.post.content || data.post.excerpt,
    images: [data.post.feature_image].filter(Boolean) as string[],
    category: data.post.category || '',
    year: data.post.published_at || '',
    location: '',
    blocks: data.post.blocks || [],
  };

  return <ProjectDetailsPage project={project} />;
}
