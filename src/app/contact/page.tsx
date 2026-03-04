import type { Metadata } from 'next';
import ContactPage from './ContactPage';

export const metadata: Metadata = {
  title: 'კონტაქტი',
  description: 'დაგვიკავშირდით — თბილისი, ი. ჭავჭავაძის გამზირი 37. ტელ: +995 555 12 34 56. ორ-შაბ 10:00-19:00.',
  alternates: { canonical: 'https://newhome.ge/contact' },
};

export default function Page() {
  return <ContactPage />;
}
