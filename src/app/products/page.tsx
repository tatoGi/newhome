import type { Metadata } from 'next';
import ProductsPage from './ProductsPage';

export const metadata: Metadata = {
  title: 'ყველა პროდუქტი',
  description: 'ავეჯი, განათება და ინტერიერის სხვა ელემენტები — ფილტრით, ფასით და ფერით. მიწოდება მთელ საქართველოში.',
  alternates: { canonical: 'https://newhome.ge/products' },
  openGraph: { title: 'პროდუქცია — NewHome.ge', description: 'ავეჯი და განათება საქართველოში.' },
};

export default function Page() {
  return <ProductsPage />;
}
