import type { Metadata } from 'next';
import { Noto_Serif_Georgian } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import '../components/header/header.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import ChatBot from '@/components/ChatBot';

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ['georgian'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-georgian',
  display: 'swap',
});

// Default fallback data in case API is down
const defaultBootstrap = {
  locale: 'ka',
  defaultLocale: 'ka',
  languages: [{ code: 'ka', name: 'ქართული', flag: 'ka', is_default: true }],
  navigation: { header: [], footer: [] },
  settings: { headerLogo: null, footerLogo: null, footerContactText: null, footerContactByLocale: null },
  routeMap: []
};

export const metadata: Metadata = {
  metadataBase: new URL('https://homespace.ge'),
  title: {
    default: 'NewHome — ავეჯი და განათება საქართველოში',
    template: '%s | NewHome.ge',
  },
  description:
    'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია. აღმოაჩინეთ საუკეთესო დიზაინი თქვენი სახლისთვის. მიწოდება მთელ საქართველოში.',
  keywords: ['ავეჯი', 'განათება', 'ინტერიერი', 'დიზაინი', 'თბილისი', 'newhome', 'homespace.ge'],
  authors: [{ name: 'NewHome.ge', url: 'https://homespace.ge' }],
  creator: 'NewHome.ge',
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: 'https://homespace.ge',
    siteName: 'NewHome.ge',
    title: 'NewHome — ავეჯი და განათება საქართველოში',
    description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NewHome.ge' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewHome — ავეჯი და განათება',
    description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://homespace.ge',
    languages: { ka: 'https://homespace.ge' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// Organization JSON-LD
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: 'NewHome.ge',
  url: 'https://homespace.ge',
  logo: 'https://homespace.ge/logo.png',
  telephone: '+995-555-12-34-56',
  email: 'info@homespace.ge',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ი. ჭავჭავაძის გამზირი 37',
    addressLocality: 'თბილისი',
    addressCountry: 'GE',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '19:00',
  },
  priceRange: '₾₾',
  sameAs: ['https://www.facebook.com/newhomege', 'https://www.instagram.com/newhomege'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bootstrapData = defaultBootstrap;

  return (
    <html lang={bootstrapData.locale} className={notoSerifGeorgian.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <Providers bootstrapData={bootstrapData as any}>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">{children}</main>
            <Footer />
          </div>
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
