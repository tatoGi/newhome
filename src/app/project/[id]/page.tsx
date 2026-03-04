import type { Metadata } from 'next';
import { getAllProjects, getProjectById } from '@/lib/data';
import ProjectDetailsPage from './ProjectDetailsPage';

export async function generateStaticParams() {
  return getAllProjects().map(p => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);
  return {
    title: project.title,
    description: `${project.title} — ${project.location}, ${project.year}. ${project.desc.slice(0, 100)}`,
    alternates: { canonical: `https://newhome.ge/project/${id}` },
    openGraph: { title: project.title, images: [project.images[0]] },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(id);
  return <ProjectDetailsPage project={project} />;
}
