import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import ProductDetailsPage from './ProductDetailsPage';
import ProductJsonLd from '@/components/ProductJsonLd';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { getServerFallbackLogo } from '@/lib/api/serverFallback';
import { buildPageMetadata } from '@/lib/metadata';

const extractProductGalleryImages = (blocks: Array<{ type?: string; data?: Record<string, unknown> }> = []): string[] =>
  blocks
    .filter((block) => block.type === 'product_gallery')
    .flatMap((block) => {
      const images = block.data?.product_images;
      return Array.isArray(images) ? images.map((image) => String(image ?? '').trim()).filter(Boolean) : [];
    });

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const data = await api.getProducts();
    return (data.products ?? []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
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

    // Resolve OG image: prefer feature_image, fall back to first gallery block image, then settings logo
    const galleryImages = extractProductGalleryImages(p.blocks || []);
    const firstGallery = (p.gallery?.[0]) || galleryImages[0] || '';
    const fallbackLogo = await getServerFallbackLogo(locale);
    const ogImage =
      toBackendAssetUrl(p.feature_image) ||
      toBackendAssetUrl(firstGallery) ||
      fallbackLogo;

    return buildPageMetadata({
      title: data.seo?.meta_title || p.title,
      description: data.seo?.meta_description || `${p.title} — ${p.price} ₾. HomeSpace.ge-ზე შეიძინეთ საუკეთესო ხარისხის ავეჯი და განათება.`,
      canonical: data.seo?.canonical_url || `https://homespace.ge/product/${slug}`,
      keywords: data.seo?.keywords || undefined,
      image: ogImage,
      url: data.seo?.canonical_url || `https://homespace.ge/product/${decodeURIComponent(slug)}`,
    });
  } catch {
    return buildPageMetadata({
      title: 'პროდუქტი ვერ მოიძებნა',
      description: 'პროდუქტი ვერ მოიძებნა - HomeSpace.ge',
      canonical: 'https://homespace.ge/product',
      keywords: ['პროდუქტი', 'HomeSpace'],
    });
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
  } catch {
    return <div>პროდუქტი ვერ მოიძებნა</div>;
  }

  if (!data || !data.product) return <div>პროდუქტი ვერ მოიძებნა</div>;

  const fallbackLogo = await getServerFallbackLogo(locale);
  const resolvedImages = [
    data.product.feature_image,
    ...(data.product.gallery || []),
    ...extractProductGalleryImages(data.product.blocks || []),
  ]
    .map((image) => toBackendAssetUrl(image))
    .filter((image, index, array): image is string => Boolean(image) && array.indexOf(image) === index);
  const images = resolvedImages.length > 0 ? resolvedImages : [fallbackLogo];

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

  // Fetch related products from the same category
  let relatedProducts: Array<{
    id: number; slug: string; name: string; price: number; oldPrice?: number;
    image: string; category: string; sale?: boolean; featured?: boolean; colors?: string[];
  }> = [];
  try {
    const allData = await api.getProducts(locale);
    relatedProducts = (allData.products ?? [])
      .filter((p) => p.category === data.product.category && p.slug !== slug)
      .slice(0, 4)
      .map((p) => {
        const galleryBlock = p.blocks?.find((b) => b.type === 'product_gallery');
        const galleryImages: unknown[] = galleryBlock?.data?.product_images ?? [];
        const firstGallery = Array.isArray(galleryImages) && galleryImages.length > 0 ? String(galleryImages[0]) : '';
        return {
          id: p.id,
          slug: p.slug,
          name: p.title,
          price: p.price,
          oldPrice: p.old_price ?? undefined,
          sale: p.on_sale,
          featured: p.is_featured,
          image: toBackendAssetUrl(firstGallery || p.feature_image || '') || fallbackLogo,
          category: p.category,
          colors: p.colors ?? [],
        };
      });
  } catch {
    // related products are optional — continue without them
  }

  const blocks = data.product.blocks ?? [];

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailsPage product={product} relatedProducts={relatedProducts} blocks={blocks} />
    </>
  );
}
