import type { Metadata } from 'next';
import ContactPage from './ContactPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'contact');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return {
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        alternates: { canonical: data.seo.canonical_url || 'https://newhome.ge/contact' },
      };
    }
  } catch {}
  return {
    title: 'კონტაქტი',
    description: 'დაგვიკავშირდით — თბილისი, ი. ჭავჭავაძის გამზირი 37. ტელ: +995 555 12 34 56. ორ-შაბ 10:00-19:00.',
    alternates: { canonical: 'https://newhome.ge/contact' },
  };
}

export default async function Page() {
  const locale = await getServerLocale();
  let pageTitle;
  let pageDescription;
  let blocks;
  try {
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'contact');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      pageTitle = data.page.title;
      pageDescription = data.page.description;
      blocks = data.page.blocks;
    }
  } catch (error) {
    console.error('Failed to fetch contact page data:', error);
  }
  return <ContactPage pageTitle={pageTitle} pageDescription={pageDescription} blocks={blocks} />;
}
