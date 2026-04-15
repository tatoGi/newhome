import { Metadata } from 'next';
import HomePage from './HomePage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const data = await api.getPage('home', locale || undefined);
    return buildPageMetadata({
      title: data.seo.meta_title || 'HomeSpace',
      description: data.seo.meta_description || undefined,
      canonical: data.seo.canonical_url || 'https://homespace.ge',
      keywords: data.seo.keywords || undefined,
      image: data.seo.og_image || data.seo.social_image || undefined,
    });
  } catch {
    return buildPageMetadata({
      title: 'HomeSpace — ავეჯი და განათება საქართველოში',
      description: 'თანამედროვე ავეჯისა და განათების ონლაინ მაღაზია.',
      canonical: 'https://homespace.ge',
      keywords: ['ავეჯი', 'განათება', 'ინტერიერი', 'დიზაინი', 'თბილისი', 'homespace', 'homespace.ge'],
    });
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
