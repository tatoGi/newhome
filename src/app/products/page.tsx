import type { Metadata } from 'next';
import ProductsPage from './ProductsPage';
import { getAllProducts } from '@/lib/data';
import type { ProductRelation } from '@/lib/api/types';

export const metadata: Metadata = {
  title: 'პროდუქცია',
  description: 'ავეჯი, განათება და ინტერიერის სხვა ელემენტები.',
  alternates: { canonical: 'https://homespace.ge/products' },
};

export default function Page() {
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

  return <ProductsPage products={products} />;
}
