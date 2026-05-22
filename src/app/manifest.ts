import type { MetadataRoute } from 'next';
import { api } from '@/lib/api/client';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { getServerLocale } from '@/lib/locale';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let iconUrl = '/logo.png';
  try {
    const serverLocale = await getServerLocale();
    const bootstrap = await api.getBootstrap(serverLocale || undefined);
    const resolved = toBackendAssetUrl(bootstrap?.settings?.headerLogo);
    if (resolved) iconUrl = resolved;
  } catch {
    // fall back to /logo.png
  }

  return {
    name: 'HomeSpace — ავეჯი და განათება',
    short_name: 'HomeSpace',
    description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია. მიწოდება მთელ საქართველოში.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#123C30',
    lang: 'ka',
    dir: 'ltr',
    categories: ['shopping', 'lifestyle'],
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
