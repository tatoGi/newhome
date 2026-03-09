import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductsPage from './ProductsPage';
import { ProductRelation } from '@/lib/api/types';

interface ProductsRouteProps {
  searchParams: Promise<{ locale?: string }>;
}

export const metadata: Metadata = {
  title: 'პროდუქცია',
  description: 'ავეჯი, განათება და ინტერიერის სხვა ელემენტები.',
  alternates: { canonical: 'https://newhome.ge/products' },
};

export default async function Page({ searchParams }: ProductsRouteProps) {
  const { locale } = await searchParams;

  let products: ProductRelation[] = [];

  try {
    const data = await api.getProducts(locale);
    products = data.products;
    
    console.log('Initial products:', products.map(p => ({ id: p.id, name: p.title, colors: p.colors, featured: p.is_featured })));
    
    // Always fetch details for each product to get complete data
    console.log('Fetching details for all products...');
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        try {
          const detailResponse = await api.getProduct(product.slug, locale);
          console.log(`Details for ${product.slug}:`, { colors: detailResponse.product.colors, featured: detailResponse.product.is_featured });
          return {
            ...product,
            colors: detailResponse.product.colors || [],
            is_featured: detailResponse.product.is_featured || false
          };
        } catch (error) {
          console.error(`Failed to fetch details for product ${product.slug}:`, error);
          return product;
        }
      })
    );
    products = productsWithDetails;
    console.log('Products after detail fetch:', products.map(p => ({ id: p.id, name: p.title, colors: p.colors, featured: p.is_featured })));
  } catch {
    // API failed - show empty state
    products = [];
  }

  return <ProductsPage products={products} />;
}
