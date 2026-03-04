import type { Metadata } from 'next';
import { getAllServices, getServiceById } from '@/lib/data';
import ServiceDetailsPage from './ServiceDetailsPage';

export async function generateStaticParams() {
  return getAllServices().map(s => ({ id: String(s.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);
  return {
    title: service.title,
    description: service.fullDesc.slice(0, 160),
    alternates: { canonical: `https://newhome.ge/service/${id}` },
    openGraph: { title: service.title, description: service.desc, images: [service.image] },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getServiceById(id);
  return <ServiceDetailsPage service={service} />;
}
