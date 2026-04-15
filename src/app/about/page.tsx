import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'ჩვენს შესახებ',
  description: 'HomSpace — 2015 წლიდან ვეხმარებით ადამიანებს საოცნებო სახლის მოწყობაში.',
  alternates: { canonical: 'https://homespace.ge/about' },
};

export default function Page() {
  return <AboutPage data={null} />;
}
