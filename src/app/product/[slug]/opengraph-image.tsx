import { ImageResponse } from 'next/og';
import { api } from '@/lib/api/client';
import { toBackendAssetUrl } from '@/lib/api/assets';
import type { Block } from '@/lib/api/types';

export const runtime = 'nodejs';
export const alt = 'Product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function firstProductImage(
  featureImage: string | null,
  gallery: string[],
  blocks: Block[],
): string {
  const fromGallery = gallery.find(Boolean);
  const fromBlocks = blocks
    .filter((b) => b.type === 'product_gallery')
    .flatMap((b) => {
      const imgs = (b.data as Record<string, unknown>)?.product_images;
      return Array.isArray(imgs) ? (imgs as unknown[]).map(String).filter(Boolean) : [];
    })[0];
  return toBackendAssetUrl(featureImage) ||
    toBackendAssetUrl(fromGallery) ||
    toBackendAssetUrl(fromBlocks) ||
    '';
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const mime = res.headers.get('content-type') || 'image/jpeg';
    return `data:${mime};base64,${Buffer.from(buffer).toString('base64')}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let productPrice = '';
  let imageData: string | null = null;

  try {
    const data = await api.getProduct(slug);
    const p = data.product;
    productPrice = p.price ? `${p.price} GEL` : '';

    const imgUrl = firstProductImage(p.feature_image, p.gallery, p.blocks);
    if (imgUrl) imageData = await fetchImageAsDataUrl(imgUrl);
  } catch {
    // fall through with defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#123C30',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Full-bleed product photo */}
        {imageData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageData}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Dark gradient overlay at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: imageData ? '200px' : '100%',
            background: imageData
              ? 'linear-gradient(to top, rgba(18,60,48,0.95) 0%, rgba(18,60,48,0.6) 60%, transparent 100%)'
              : '#123C30',
            display: 'flex',
          }}
        />

        {/* Branding + price */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '28px 48px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              color: '#D4AF37',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            HOMESPACE.GE
          </div>

          {productPrice && (
            <div
              style={{
                color: '#ffffff',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {productPrice}
            </div>
          )}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 5,
            backgroundColor: '#D4AF37',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
