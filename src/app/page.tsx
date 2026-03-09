import { Metadata } from 'next';
import HomePage from './HomePage';
import { api } from '@/lib/api/client';

interface PageProps {
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await searchParams;
  try {
    const data = await api.getPage('home', locale);
    return {
      title: data.seo.meta_title || 'NewHome',
      description: data.seo.meta_description,
      keywords: data.seo.keywords,
      alternates: {
        canonical: data.seo.canonical_url || 'https://newhome.ge',
      },
    };
  } catch {
    return {
      title: 'NewHome — ავეჯი და განათება საქართველოში',
      description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია.',
    };
  }
}

export default async function Page({ searchParams }: PageProps) {
  const { locale } = await searchParams;
  let homeData = null;

  try {
    homeData = await api.getPage('home', locale);
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

  return <HomePage data={homeData} />;
}
