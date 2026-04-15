import type { Metadata } from 'next';
import ProductDetailsPage from './ProductDetailsPage';
import ProductJsonLd from '@/components/ProductJsonLd';
import { getAllProducts } from '@/lib/data';

export function generateStaticParams() {
  return getAllProducts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getAllProducts().find(p => p.slug === slug);
  if (!p) return { title: 'პროდუქტი ვერ მოიძებნა' };
  return {
    title: p.name,
    description: `${p.name} — ${p.price} ₾. HomSpace.ge-ზე შეიძინეთ საუკეთესო ხარისხის ავეჯი და განათება.`,
    alternates: { canonical: `https://homespace.ge/product/${slug}` },
    openGraph: {
      title: p.name,
      description: `${p.name} — ${p.price} ₾`,
      url: `https://homespace.ge/product/${slug}`,
      images: p.image ? [{ url: p.image, width: 1200, height: 800 }] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getAllProducts().find(p => p.slug === slug);

  if (!p) return <div>პროდუქტი ვერ მოიძებნა</div>;

  const product = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice,
    sale: p.sale ?? false,
    featured: p.featured ?? false,
    brand: '',
    description: p.description ?? '',
    content: '',
    coverImage: p.image,
    images: p.images ?? [p.image],
    category: p.category,
    colors: p.colors ?? [],
  };

  return (
    <>
      <ProductJsonLd product={product as any} />
      <ProductDetailsPage product={product as any} />
    </>
  );
}
