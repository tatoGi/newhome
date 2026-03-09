import { Suspense } from 'react';
import type { Metadata } from 'next';
import CartPage from './CartPage';

export const metadata: Metadata = { title: 'კალათა' };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CartPage />
    </Suspense>
  );
}
