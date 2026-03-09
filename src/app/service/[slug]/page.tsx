import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ServiceDetailsPage from './ServiceDetailsPage';

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ locale?: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await searchParams;
  const data = await api.getService(slug, locale);
  const s = data.post;

  return {
    title: data.seo?.meta_title || s.title,
    description: data.seo?.meta_description || s.excerpt || undefined,
    alternates: { canonical: data.seo?.canonical_url || `https://newhome.ge/service/${slug}` },
    openGraph: {
      title: data.seo?.meta_title || s.title,
      description: data.seo?.meta_description || undefined,
      images: s.feature_image ? [{ url: s.feature_image }] : [],
    },
  };
}

export default async function Page({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ locale?: string }>
}) {
  const { slug } = await params;
  const { locale } = await searchParams;
  const data = await api.getService(slug, locale);

  if (!data || !data.post) return <div>სერვისი ვერ მოიძებნა</div>;

  const service = {
    id: data.post.id,
    slug: data.post.slug,
    title: data.post.title,
    desc: data.post.excerpt,
    fullDesc: data.post.content,
    image: data.post.feature_image || '',
    icon: 'ShieldCheck', // Fallback or add to API
    blocks: data.post.blocks || [],
  };

  return <ServiceDetailsPage service={service as any} />;
}
