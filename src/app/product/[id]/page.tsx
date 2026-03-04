import type { Metadata } from 'next';
import { getAllProducts, getProductById } from '@/lib/data';
import ProductDetailsPage from './ProductDetailsPage';
import ProductJsonLd from '@/components/ProductJsonLd';

export async function generateStaticParams() {
  return getAllProducts().map(p => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return {
    title: product.name,
    description: product.description ?? `${product.name} — ${product.price} ₾. NewHome.ge-ზე შეიძინეთ საუკეთესო ხარისხის ავეჯი და განათება.`,
    alternates: { canonical: `https://newhome.ge/product/${id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0], width: 1200, height: 800 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailsPage product={product} />
    </>
  );
}
