export const LOCALE_COOKIE = 'newhome_locale';

/**
 * Static site — locale is always Georgian.
 */
export async function getServerLocale(): Promise<string> {
    return 'ka';
}
