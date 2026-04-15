import type { Metadata } from 'next';
import WishlistPage from './WishlistPage';
import { buildPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'სურვილების სია',
  description: 'HomeSpace სურვილების სია — შეინახეთ თქვენთვის საინტერესო პროდუქტები შემდეგი მომხმარებლისთვის.',
  canonical: 'https://homespace.ge/wishlist',
  keywords: ['სურვილების სია', 'wishlist', 'HomeSpace', 'პროდუქტები', 'შენახვა'],
});

export default function Page() {
  return <WishlistPage />;
}
