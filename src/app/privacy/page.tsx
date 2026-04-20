import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import PrivacyPage from './PrivacyPage';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'კონფიდენციალურობის პოლიტიკა — HomeSpace',
    description:
      'HomeSpace-ის კონფიდენციალურობის პოლიტიკა. გაიგეთ, როგორ ვაგროვებთ, ვიყენებთ და ვიცავთ თქვენს პერსონალურ მონაცემებს.',
    canonical: 'https://homespace.ge/privacy',
    keywords: ['კონფიდენციალურობა', 'პერსონალური მონაცემები', 'GDPR', 'HomeSpace'],
  });
}

export default function Page() {
  return <PrivacyPage />;
}
