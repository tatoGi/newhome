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
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';

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
  metadataBase: new URL('https://newhome.ge'),
  title: {
    default: 'NewHome — ავეჯი და განათება საქართველოში',
    template: '%s | NewHome.ge',
  },
  description:
    'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია. აღმოაჩინეთ საუკეთესო დიზაინი თქვენი სახლისთვის. მიწოდება მთელ საქართველოში.',
  keywords: ['ავეჯი', 'განათება', 'ინტერიერი', 'დიზაინი', 'თბილისი', 'newhome', 'newhome.ge'],
  authors: [{ name: 'NewHome.ge', url: 'https://newhome.ge' }],
  creator: 'NewHome.ge',
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: 'https://newhome.ge',
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
    canonical: 'https://newhome.ge',
    languages: { ka: 'https://newhome.ge' },
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
  url: 'https://newhome.ge',
  logo: 'https://newhome.ge/logo.png',
  telephone: '+995-555-12-34-56',
  email: 'info@newhome.ge',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverLocale = await getServerLocale();
  let bootstrapData;
  try {
    bootstrapData = await api.getBootstrap(serverLocale || undefined);
  } catch (error) {
    console.error('Failed to fetch bootstrap data:', error);
    bootstrapData = defaultBootstrap;
  }

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
