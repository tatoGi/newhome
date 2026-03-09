import type { Metadata } from 'next';
import AccountPage from './AccountPage';

export const metadata: Metadata = {
  title: 'ანგარიში',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountPage />;
}
