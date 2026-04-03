import { Metadata } from 'next';
import HomePage from './HomePage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const data = await api.getPage('home', locale || undefined);
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

export default async function Page() {
  const locale = await getServerLocale();
  let homeData = null;

  try {
    homeData = await api.getPage('home', locale || undefined);
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

  return <HomePage data={homeData} />;
}
