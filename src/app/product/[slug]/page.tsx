import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductDetailsPage from './ProductDetailsPage';
import ProductJsonLd from '@/components/ProductJsonLd';
import { toBackendAssetUrl } from '@/lib/api/assets';

const extractProductGalleryImages = (blocks: Array<{ type?: string; data?: Record<string, unknown> }> = []): string[] =>
  blocks
    .filter((block) => block.type === 'product_gallery')
    .flatMap((block) => {
      const images = block.data?.product_images;
      return Array.isArray(images) ? images.map((image) => String(image ?? '').trim()).filter(Boolean) : [];
    });

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // Purely dynamic - no static params
  return [];
}

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ locale?: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await searchParams;
  
  try {
    const data = await api.getProduct(slug, locale);
    const p = data.product;

    return {
      title: data.seo?.meta_title || p.title,
      description: data.seo?.meta_description || `${p.title} — ${p.price} ₾. NewHome.ge-ზე შეიძინეთ საუკეთესო ხარისხის ავეჯი და განათება.`,
      alternates: { canonical: data.seo?.canonical_url || `https://newhome.ge/product/${slug}` },
      openGraph: {
        title: data.seo?.meta_title || p.title,
        description: data.seo?.meta_description || `${p.title} — ${p.price} ₾. NewHome.ge-ზე შეიძინეთ საუკეთესო ხარისხის ავეჯი და განათება.`,
        images: [{ url: toBackendAssetUrl(p.feature_image), width: 1200, height: 800 }],
      },
    };
  } catch (error) {
    // Error metadata
    return {
      title: 'პროდუქტი ვერ მოიძებნა',
      description: 'პროდუქტი ვერ მოიძებნა - NewHome.ge',
    };
  }
}

export default async function Page({ params, searchParams }: {
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ locale?: string }>
}) {
  const { slug } = await params;
  const { locale } = await searchParams;
  
  let data;
  try {
    data = await api.getProduct(slug, locale);
  } catch (error) {
    // If API fails, show error page
    return <div>პროდუქტი ვერ მოიძებნა</div>;
  }

  if (!data || !data.product) return <div>პროდუქტი ვერ მოიძებნა</div>;

  const images = [
    data.product.feature_image,
    ...(data.product.gallery || []),
    ...extractProductGalleryImages(data.product.blocks || []),
  ]
    .map((image) => toBackendAssetUrl(image))
    .filter((image, index, array): image is string => Boolean(image) && array.indexOf(image) === index);

  const product = {
    id: data.product.id,
    slug: data.product.slug,
    name: data.product.title,
    price: data.product.price,
    oldPrice: data.product.old_price ?? undefined,
    sale: data.product.on_sale ?? false,
    featured: data.product.is_featured ?? false,
    brand: data.product.brand || '',
    description: data.product.description,
    content: data.product.content || '',
    coverImage: toBackendAssetUrl(data.product.cover_image || ''),
    images,
    category: data.product.category || '',
    colors: data.product.colors || [],
  };

  return (
    <>
      <ProductJsonLd product={product as any} />
      <ProductDetailsPage product={product as any} />
    </>
  );
}
