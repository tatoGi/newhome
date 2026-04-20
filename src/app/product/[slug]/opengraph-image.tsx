import { ImageResponse } from 'next/og';
import { api } from '@/lib/api/client';
import { toBackendAssetUrl } from '@/lib/api/assets';

export const runtime = 'nodejs';
export const alt = 'Product';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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

  let productName = '';
  let productPrice = '';
  let imageData: string | null = null;

  try {
    const data = await api.getProduct(slug);
    const p = data.product;
    productName = p.title || '';
    productPrice = p.price ? `${p.price} GEL` : '';

    const imgUrl =
      toBackendAssetUrl(p.feature_image) ||
      toBackendAssetUrl((p.gallery as string[] | undefined)?.[0]) ||
      '';
    if (imgUrl) imageData = await fetchImageAsDataUrl(imgUrl);
  } catch {
    // fall through with defaults
  }

  const hasImage = Boolean(imageData);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#0F2E47',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Product image (left 55%) */}
        {hasImage && (
          <div
            style={{
              display: 'flex',
              width: '55%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageData!}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Info panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: hasImage ? '56px 52px' : '56px 80px',
            flex: 1,
          }}
        >
          {/* Brand */}
          <div
            style={{
              color: '#CC7A50',
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 3,
              marginBottom: 32,
            }}
          >
            HOMESPACE.GE
          </div>

          {/* Product name — truncate long names */}
          {productName ? (
            <div
              style={{
                color: '#ffffff',
                fontSize: hasImage ? 38 : 48,
                fontWeight: 700,
                lineHeight: 1.25,
                marginBottom: 28,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {productName}
            </div>
          ) : null}

          {/* Price */}
          {productPrice ? (
            <div
              style={{
                color: '#CC7A50',
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              {productPrice}
            </div>
          ) : null}

          {/* Tagline */}
          <div
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 15,
              marginTop: 40,
            }}
          >
            aveji • ganaTeba • interi
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: '#CC7A50',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
