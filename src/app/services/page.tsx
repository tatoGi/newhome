import type { Metadata } from 'next';
import ServicesPage from './ServicesPage';

export const metadata: Metadata = {
  title: 'სერვისები',
  description: 'ინტერიერის დიზაინი, ავეჯის დამზადება, განათების დაგეგმარება და რემონტი — HomSpace.ge-ს სრული სერვისები.',
  alternates: { canonical: 'https://homespace.ge/services' },
};

export default function Page() {
  return <ServicesPage posts={undefined} pageTitle={undefined} pageDescription={undefined} blocks={undefined} />;
}
