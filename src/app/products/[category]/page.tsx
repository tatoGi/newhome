import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductsPage from '../ProductsPage';
import { ProductRelation } from '@/lib/api/types';
import { getServerLocale } from '@/lib/locale';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return {
    title: category,
    description: `${category} — NewHome.ge-ს კოლექცია.`,
    alternates: { canonical: `https://newhome.ge/products/${category}` },
  };
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
