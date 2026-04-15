import { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'HomSpace — ავეჯი და განათება საქართველოში',
  description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია.',
  alternates: { canonical: 'https://homespace.ge' },
};

export default function Page() {
  return <HomePage data={null} />;
}
