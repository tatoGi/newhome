import type { Metadata, Viewport } from 'next';
import { Noto_Serif_Georgian } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import '../components/header/header.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import ChatBotLoader from '@/components/ChatBotLoader';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { api } from '@/lib/api/client';
import { getServerLocale } from '@/lib/locale';
import { toBackendAssetUrl } from '@/lib/api/assets';

const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ['georgian'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-georgian',
  display: 'swap',
});

const defaultBootstrap = {
  locale: 'ka',
  defaultLocale: 'ka',
  languages: [{ code: 'ka', name: 'ქართული', flag: 'ka', is_default: true }],
  navigation: { header: [], footer: [] },
  settings: { headerLogo: null, footerLogo: null, footerContactText: null, footerContactByLocale: null },
  routeMap: [],
};

export const viewport: Viewport = {
  themeColor: '#123C30',
  width: 'device-width',
  initialScale: 1,
};

const SITE_URL = 'https://homespace.ge';
const SITE_NAME = 'HomeSpace.ge';

export async function generateMetadata(): Promise<Metadata> {
  const serverLocale = await getServerLocale();
  let headerLogoPath: string | null = null;
  try {
    const bootstrap = await api.getBootstrap(serverLocale || undefined);
    headerLogoPath = bootstrap?.settings?.headerLogo ?? null;
  } catch {
    headerLogoPath = null;
  }

  const faviconUrl = toBackendAssetUrl(headerLogoPath) || '/favicon.ico';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'HomeSpace — ავეჯი და განათება საქართველოში',
      template: `%s | ${SITE_NAME}`,
    },
    description:
      'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია. აღმოაჩინეთ საუკეთესო დიზაინი თქვენი სახლისთვის. მიწოდება მთელ საქართველოში.',
    keywords: ['ავეჯი', 'განათება', 'ინტერიერი', 'დიზაინი', 'თბილისი', 'homespace', 'homespace.ge'],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      title: 'HomeSpace',
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      type: 'website',
      locale: 'ka_GE',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: 'HomeSpace — ავეჯი და განათება საქართველოში',
      description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია.',
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'HomeSpace — ავეჯი და განათება',
      description: 'თანამედროვე ავეჯის და განათების ონლაინ მაღაზია.',
      images: [`${SITE_URL}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    },
  };
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'თბილისი',
    addressCountry: 'GE',
  },
  priceRange: '₾₾',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverLocale = await getServerLocale();
  let bootstrapData;
  try {
    bootstrapData = await api.getBootstrap(serverLocale || undefined);
  } catch {
    bootstrapData = defaultBootstrap;
  }

  return (
    <html lang={bootstrapData.locale} className={notoSerifGeorgian.variable} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers bootstrapData={bootstrapData as any}>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">{children}</main>
            <Footer />
          </div>
          <ChatBotLoader />
        </Providers>
        <MetaPixel />
        <Analytics />
      </body>
    </html>
  );
}
