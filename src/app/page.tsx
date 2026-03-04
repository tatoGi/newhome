import type { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'NewHome — ავეჯი და განათება საქართველოში',
  description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია. სწრაფი მიწოდება, ხარისხის გარანტია, 24/7 მხარდაჭერა.',
  alternates: { canonical: 'https://newhome.ge' },
};

export default function Page() {
  return <HomePage />;
}
