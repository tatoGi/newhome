import type { Metadata } from 'next';

const SITE_URL = 'https://homespace.ge';
const SITE_NAME = 'HomeSpace.ge';
const DEFAULT_IMAGE = '/og-image.jpg';

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
    image?: string;
    url?: string;
}): Metadata => {
    const canonicalUrl = canonical || url || SITE_URL;
    const pageUrl = url || canonicalUrl;
    const imageUrl = image || DEFAULT_IMAGE;

    return {
        title,
        description,
        keywords: normalizeKeywords(keywords),
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: SITE_NAME,
            type: 'website',
            images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
};
