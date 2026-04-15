import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPage from './SearchPage';

export const metadata: Metadata = {
    title: 'ძებნა | NewHome',
};

export default function Page() {
    return (
        <Suspense>
            <SearchPage />
        </Suspense>
    );
}
