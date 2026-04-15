import type { Metadata } from 'next';
import AccountPage from './AccountPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'ანგარიში',
  description: 'HomeSpace პირადი გვერდი — შეკვეთების და სასურველ პროდუქტების მართვა.',
  canonical: 'https://homespace.ge/account',
  keywords: ['ანგარიში', 'HomeSpace', 'შეკვეთის ისტორია', 'საჩუქარი'],
});

export default function Page() {
  return <AccountPage />;
}
