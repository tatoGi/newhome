import type { Metadata } from 'next';

const SITE_URL = 'https://homespace.ge';
const SITE_NAME = 'HomeSpace.ge';
const DEFAULT_DESCRIPTION = 'HomeSpace provides modern furniture, lighting, and interior design solutions in Georgia.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const normalizeKeywords = (keywords?: string | string[]): string[] | undefined => {
    if (!keywords) {
        return undefined;
    }

    if (Array.isArray(keywords)) {
        return keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
    }

    return String(keywords)
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean);
};

export const buildPageMetadata = ({
    title,
    description,
    canonical,
    keywords,
    image,
    url,
}: {
    title: string;
    description?: string;
    canonical?: string;
    keywords?: string | string[];
    /** Pass a URL string to use a specific image, omit for the default fallback, or pass `null` to let an opengraph-image route handler provide the image. */
    image?: string | null;
    url?: string;
}): Metadata => {
    const canonicalUrl = canonical || url || SITE_URL;
    const pageUrl = url || canonicalUrl;
    // null means "no explicit image" — opengraph-image.tsx route handler takes over
    const imageUrl = image === null ? null : (image || DEFAULT_IMAGE);

    const metaDescription = description || DEFAULT_DESCRIPTION;

    return {
        title,
        description: metaDescription,
        keywords: normalizeKeywords(keywords),
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description: metaDescription,
            url: pageUrl,
            siteName: SITE_NAME,
            locale: 'ka_GE',
            type: 'website',
            ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: metaDescription,
            ...(imageUrl ? { images: [imageUrl] } : {}),
        },
    };
};
