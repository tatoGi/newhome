import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api/client';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { getServerFallbackLogo } from '@/lib/api/serverFallback';
import ServiceDetailsPage from './ServiceDetailsPage';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateStaticParams() {
  try {
    const bootstrap = await api.getBootstrap();
    const route = bootstrap.routeMap.find((r) => r.template === 'service' || r.template === 'services');
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
    const data = await api.getService(slug, locale);
    const intro = data.post.blocks?.find((b: any) => b.type === 'post_intro');
    const title = intro?.data?.title || data.post.title;
    const fallbackLogo = await getServerFallbackLogo(locale);
    const image = resolveImageOrFallback(intro?.data?.post_image || data.post.feature_image || '', fallbackLogo);
    return buildPageMetadata({
      title: data.seo?.meta_title || title,
      description: data.seo?.meta_description || data.post.excerpt || undefined,
      canonical: data.seo?.canonical_url || `https://homespace.ge/service/${slug}`,
      keywords: data.seo?.keywords || undefined,
      image: image || undefined,
    });
  } catch {
    return buildPageMetadata({
      title: 'სერვისი',
      description: 'HomeSpace სერვისი',
      canonical: 'https://homespace.ge/service',
      keywords: ['სერვისი', 'HomeSpace'],
    });
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { locale: queryLocale } = await searchParams;
  const locale = queryLocale || await getServerLocale() || undefined;

  let data;
  try {
    data = await api.getService(slug, locale);
  } catch {
    notFound();
  }

  if (!data?.post) notFound();

  const service = {
    id: data.post.id,
    slug: data.post.slug ?? slug,
    title: data.post.title,
    desc: data.post.excerpt,
    fullDesc: data.post.content,
    coverImage: data.post.cover_image || '',
    image: data.post.feature_image || '',
    blocks: data.post.blocks || [],
  };

  let phone: string | null = null;
  try {
    const bootstrap = await api.getBootstrap();
    phone = bootstrap.settings.footerContactText ?? null;
  } catch { }

  return <ServiceDetailsPage service={service} phone={phone} />;
}
