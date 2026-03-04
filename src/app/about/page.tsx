import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'ჩვენს შესახებ',
  description: 'NewHome — 2015 წლიდან ვეხმარებით ადამიანებს საოცნებო სახლის მოწყობაში. 10+ წლის გამოცდილება, 500+ კმაყოფილი კლიენტი.',
  alternates: { canonical: 'https://newhome.ge/about' },
  openGraph: { title: 'ჩვენს შესახებ — NewHome.ge', description: '10+ წლის გამოცდილება ინტერიერის დიზაინში.' },
};

export default function Page() {
  return <AboutPage />;
}
