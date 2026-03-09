import type { Metadata } from 'next';
import WishlistPage from './WishlistPage';

export const metadata: Metadata = { title: 'სურვილების სია' };

export default function Page() {
  return <WishlistPage />;
}
