import { Suspense } from 'react';
import type { Metadata } from 'next';
import CartPage from './CartPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'კალათა',
  description: 'თქვენი კალათა HomeSpace-ზე — შეამოწმეთ არჩეული პროდუქტები და გაიარეთ შეკვეთის გაფორმება.',
  canonical: 'https://homespace.ge/cart',
  keywords: ['კალათა', 'HomeSpace', 'შეკვეთები', 'ავეჯი', 'განათება'],
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CartPage />
    </Suspense>
  );
}
