import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api/client';
import { toBackendAssetUrl } from '@/lib/api/assets';
import ProjectDetailsPage from './ProjectDetailsPage';
import { getServerLocale } from '@/lib/locale';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { locale: queryLocale } = await searchParams;
    const locale = queryLocale || await getServerLocale() || undefined;
    const data = await api.getProject(slug, locale);
    const intro = data.post.blocks?.find((b: any) => b.type === 'post_intro');
    const title = intro?.data?.title || data.post.title;
    const image = toBackendAssetUrl(intro?.data?.post_image || data.post.feature_image || '');
    return {
      title: data.seo?.meta_title || title,
      description: data.seo?.meta_description || data.post.excerpt || undefined,
      alternates: { canonical: data.seo?.canonical_url || `https://newhome.ge/project/${slug}` },
      openGraph: {
        title: data.seo?.meta_title || title,
        description: data.seo?.meta_description || undefined,
        images: image ? [{ url: image }] : [],
      },
    };
  } catch {
    return { title: 'პროექტი' };
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
