import type { Metadata } from 'next';
import CheckoutPage from './CheckoutPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'შეკვეთის გაფორმება',
  description: 'დაასრულეთ შეკვეთა HomeSpace-ზე — გადასახადი, მიწოდება და მიწოდების ინფორმაცია.',
  canonical: 'https://homespace.ge/checkout',
  keywords: ['შეკვეთის გაფორმება', 'checkout', 'HomeSpace', 'კალათა'],
});

export default function Page() {
  return <CheckoutPage />;
}
