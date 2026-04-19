import 'server-only';
import { cache } from 'react';
import { api } from '@/lib/api/client';
import { toBackendAssetUrl } from '@/lib/api/assets';

export const getServerFallbackLogo = cache(async (locale?: string): Promise<string> => {
    try {
        const bootstrap = await api.getBootstrap(locale);
        return toBackendAssetUrl(bootstrap.settings.headerLogo) || '/logo.png';
    } catch {
        return '/logo.png';
    }
});
