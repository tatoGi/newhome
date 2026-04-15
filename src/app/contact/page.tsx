import type { Metadata } from 'next';
import ContactPage from './ContactPage';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = await getServerLocale();
    const bootstrap = await api.getBootstrap(locale || undefined);
    const route = bootstrap.routeMap.find((r) => r.template === 'contact');
    if (route) {
      const data = await api.getPage(route.slug, locale || undefined);
      return buildPageMetadata({
        title: data.seo.meta_title || data.page.title,
        description: data.seo.meta_description || '',
        canonical: data.seo.canonical_url || 'https://homespace.ge/contact',
        keywords: data.seo.keywords,
        image: data.seo.og_image || data.seo.social_image || undefined,
      });
    }
  } catch { }
  return buildPageMetadata({
    title: 'კონტაქტი',
    description: 'დაგვიკავშირდით — თბილისი, ი. ჭავჭავაძის გამზირი 37. ტელ: +995 555 12 34 56. ორშაბათი-შაბათი 10:00-19:00.',
    canonical: 'https://homespace.ge/contact',
    keywords: ['კონტაქტი', 'HomeSpace', 'მხარდაჭერა', 'ტელეფონი'],
  });
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
