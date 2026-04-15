import { cookies } from 'next/headers';

export const LOCALE_COOKIE = 'newhome_locale';

/**
 * Read the active locale on the server side.
 * Priority: cookie → empty string (caller falls back to API default)
 */
export async function getServerLocale(): Promise<string> {
    const store = await cookies();
    return store.get(LOCALE_COOKIE)?.value || '';
}
