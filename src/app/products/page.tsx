import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductsPage from './ProductsPage';
import { ProductRelation } from '@/lib/api/types';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'პროდუქცია',
  description: 'ავეჯი, განათება და ინტერიერის სხვა ელემენტები.',
  canonical: 'https://homespace.ge/products',
  keywords: ['პროდუქცია', 'ავეჯი', 'განათება', 'ინტერიერი', 'HomeSpace'],
});

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
