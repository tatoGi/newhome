import type { Metadata } from 'next';
import ProductsPage from '../ProductsPage';
import { getAllProducts } from '@/lib/data';
import type { ProductRelation } from '@/lib/api/types';

export async function generateStaticParams() {
  const products = getAllProducts();
  const categories = [...new Set(products.map(p => p.category))];
  return categories.map(category => ({ category: encodeURIComponent(category) }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  return {
    title: decoded,
    description: `${decoded} — NewHome.ge-ს კოლექცია.`,
    alternates: { canonical: `https://newhome.ge/products/${category}` },
  };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const products: ProductRelation[] = getAllProducts().map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.name,
    price: p.price,
    old_price: p.oldPrice ?? null,
    on_sale: p.sale ?? false,
    brand: '',
    feature_image: p.image,
    category: p.category,
    colors: p.colors ?? [],
    blocks: [],
  }));

  return <ProductsPage products={products} initialCategory={decodeURIComponent(category)} />;
}
