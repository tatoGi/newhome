import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailsPage from './ProjectDetailsPage';
import { getAllProjects } from '@/lib/data';

export function generateStaticParams() {
  return getAllProjects().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getAllProjects().find(p => p.slug === slug);
  if (!p) return { title: 'პროექტი' };
  return {
    title: p.title,
    description: p.desc,
    alternates: { canonical: `https://homespace.ge/project/${slug}` },
    openGraph: {
      title: p.title,
      description: p.desc,
      url: `https://homespace.ge/project/${slug}`,
      images: p.image ? [{ url: p.image }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getAllProjects().find(p => p.slug === slug);

  if (!p) notFound();

  const project = {
    id: p.id,
    slug: p.slug,
    title: p.title,
    desc: p.desc,
    images: p.images ?? [p.image],
    category: p.category,
    year: p.year,
    location: p.location,
    blocks: [],
  };

  return <ProjectDetailsPage project={project} />;
}
