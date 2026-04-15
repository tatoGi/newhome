import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailsPage from './ServiceDetailsPage';
import { getAllServices } from '@/lib/data';

export function generateStaticParams() {
  return getAllServices().map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getAllServices().find(s => s.slug === slug);
  if (!s) return { title: 'სერვისი' };
  return {
    title: s.title,
    description: s.desc,
    alternates: { canonical: `https://homespace.ge/service/${slug}` },
    openGraph: {
      title: s.title,
      description: s.desc,
      url: `https://homespace.ge/service/${slug}`,
      images: s.image ? [{ url: s.image }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getAllServices().find(s => s.slug === slug);

  if (!s) notFound();

  const service = {
    id: s.id,
    slug: s.slug,
    title: s.title,
    desc: s.desc,
    fullDesc: s.fullDesc,
    image: s.image,
    blocks: [],
  };

  return <ServiceDetailsPage service={service} phone={null} />;
}
