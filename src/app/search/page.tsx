import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPage from './SearchPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
    title: 'ძებნა | HomeSpace',
    description: 'გააკეთეთ მოძებნა HomeSpace-ზე და იპოვეთ სასურველი ავეჯი, განათება და დიზაინის პროდუქტები.',
    canonical: 'https://homespace.ge/search',
    keywords: ['ძებნა', 'Search', 'HomeSpace', 'პროდუქტები'],
});

export default function Page() {
    return (
        <Suspense>
            <SearchPage />
        </Suspense>
    );
}
