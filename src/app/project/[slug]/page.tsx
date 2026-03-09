import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProjectDetailsPage from './ProjectDetailsPage';

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ locale?: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await searchParams;
  const data = await api.getProject(slug, locale);
  const p = data.post;

  return {
    title: data.seo?.meta_title || p.title,
    description: data.seo?.meta_description || p.excerpt || undefined,
    alternates: { canonical: data.seo?.canonical_url || `https://newhome.ge/project/${slug}` },
    openGraph: {
      title: data.seo?.meta_title || p.title,
      description: data.seo?.meta_description || undefined,
      images: p.feature_image ? [{ url: p.feature_image }] : [],
    },
  };
}

export default async function Page({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ locale?: string }>
}) {
  const { slug } = await params;
  const { locale } = await searchParams;
  const data = await api.getProject(slug, locale);

  if (!data || !data.post) return <div>პროექტი ვერ მოიძებნა</div>;

  const project = {
    id: data.post.id,
    slug: data.post.slug,
    title: data.post.title,
    desc: data.post.content || data.post.excerpt,
    images: [data.post.feature_image],
    location: 'თბილისი', // Needs dynamic in API later
    year: '2024',
    category: 'ინტერიერი',
    blocks: data.post.blocks || [],
  };

  return <ProjectDetailsPage project={project as any} />;
}
