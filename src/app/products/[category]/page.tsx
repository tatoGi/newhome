import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductsPage from '../ProductsPage';
import { ProductRelation } from '@/lib/api/types';
import { getServerLocale } from '@/lib/locale';
import { buildPageMetadata } from '@/lib/metadata';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return buildPageMetadata({
    title: category,
    description: `${category} — HomeSpace.ge-ს კოლექცია.`,
    canonical: `https://homespace.ge/products/${category}`,
    keywords: [category, 'პროდუქცია', 'HomeSpace'],
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const { category } = await params;
  const { locale } = await searchParams;
  const serverLocale = locale || await getServerLocale() || undefined;

  let products: ProductRelation[] = [];

  try {
    const data = await api.getProducts(serverLocale);
    products = data.products ?? [];
  } catch {
    products = [];
  }

  return <ProductsPage products={products} initialCategory={category} />;
}
