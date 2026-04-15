import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductsPage from './ProductsPage';
import { ProductRelation } from '@/lib/api/types';
import { getServerLocale } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'პროდუქცია',
  description: 'ავეჯი, განათება და ინტერიერის სხვა ელემენტები.',
  alternates: { canonical: 'https://newhome.ge/products' },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale } = await searchParams;
  const serverLocale = locale || await getServerLocale() || undefined;

  let products: ProductRelation[] = [];

  try {
    const data = await api.getProducts(serverLocale);
    products = data.products ?? [];
  } catch {
    products = [];
  }

  return <ProductsPage products={products} />;
}
