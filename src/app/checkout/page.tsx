import type { Metadata } from 'next';
import CheckoutPage from './CheckoutPage';

export const metadata: Metadata = {
  title: 'შეკვეთის გაფორმება',
};

export default function Page() {
  return <CheckoutPage />;
}
