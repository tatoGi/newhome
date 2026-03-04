import type { Metadata } from 'next';
import ServicesPage from './ServicesPage';

export const metadata: Metadata = {
  title: 'სერვისები',
  description: 'ინტერიერის დიზაინი, ავეჯის დამზადება, განათების დაგეგმარება და რემონტი — NewHome.ge-ს სრული სერვისები.',
  alternates: { canonical: 'https://newhome.ge/services' },
};

export default function Page() {
  return <ServicesPage />;
}
