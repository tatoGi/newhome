import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import TermsPage from './TermsPage';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'წესები და პირობები — HomeSpace',
    description:
      'HomeSpace-ის გამოყენების წესები და პირობები. შეიტყვეთ შეკვეთის, მიტანის, დაბრუნების და გარანტიის პირობების შესახებ.',
    canonical: 'https://homespace.ge/terms',
    keywords: ['წესები', 'პირობები', 'HomeSpace', 'შეკვეთა', 'დაბრუნება'],
  });
}

export default function Page() {
  return <TermsPage />;
}
