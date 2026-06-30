import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bestyclothing.shop'),

  title: {
    default: 'Besty Clothing — African Fashion | Ankara, Kente & Aso-Oke',
    template: '%s | Besty Clothing',
  },
  description:
    'Shop authentic African fashion at Besty Clothing. Discover stunning ankara, kente, aso-oke and handcrafted African clothing delivered across Nigeria. Lagos-based African style brand.',
  keywords: [
    'african fashion nigeria',
    'ankara clothing',
    'kente fabric',
    'aso-oke',
    'nigerian fashion store',
    'besty clothing',
    'african dresses lagos',
    'african print clothing',
    'ankara dress',
    'african style shop',
    'lagos fashion',
    'nigerian clothing online',
    'african fashion online store',
    'african print dresses',
    'buy ankara fabric nigeria',
    'traditional nigerian clothing',
    'african women fashion',
  ],
  authors: [{ name: 'Besty Clothing', url: 'https://www.bestyclothing.shop' }],
  creator: 'Besty Clothing',
  publisher: 'Besty Clothing',
  category: 'Fashion & Clothing',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.bestyclothing.shop',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.bestyclothing.shop',
    siteName: 'Besty Clothing',
    title: 'Besty Clothing — African Fashion | Ankara, Kente & Aso-Oke',
    description:
      'Shop authentic African fashion at Besty Clothing. Discover stunning ankara, kente, aso-oke and handcrafted African clothing delivered across Nigeria.',
    images: [
      {
        url: '/besty-logo.png',
        width: 1200,
        height: 630,
        alt: 'Besty Clothing — African Fashion',
        type: 'image/png',
      },
    ],
    locale: 'en_NG',
    countryName: 'Nigeria',
    emails: ['hello@bestyclothing.shop'],
    phoneNumbers: ['+2349039456476'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bestyclothing',
    creator: '@bestyclothing',
    title: 'Besty Clothing — African Fashion | Ankara, Kente & Aso-Oke',
    description:
      'Shop authentic African fashion at Besty Clothing. Ankara, kente, aso-oke and more. Delivered across Nigeria.',
    images: [
      {
        url: '/besty-logo.png',
        alt: 'Besty Clothing — African Fashion',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/besty-logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/besty-logo.png', type: 'image/png' },
    ],
    shortcut: '/besty-logo.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: '',
  },
  other: {
    'http-equiv': 'X-UA-Compatible',
    'content': 'IE=edge',
    'revisit-after': '7 days',
    'rating': 'general',
    'language': 'English',
    'geo.region': 'NG-LA',
    'geo.placename': 'Lagos, Nigeria',
    'geo.position': '6.5244;3.3792',
    'ICBM': '6.5244, 3.3792',
    'theme-color': '#1A0800',
    'msapplication-TileColor': '#1A0800',
    'msapplication-TileImage': '/besty-logo.png',
    'msapplication-navbutton-color': '#C9A227',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Besty Clothing',
    'application-name': 'Besty Clothing',
    'format-detection': 'telephone=yes',
    'color-scheme': 'light',
    'referrer': 'origin-when-cross-origin',
    'og:email': 'hello@bestyclothing.shop',
    'og:phone_number': '+2349039456476',
    'og:street-address': 'Lagos',
    'og:locality': 'Lagos',
    'og:country-name': 'Nigeria',
    'article:publisher': 'https://www.bestyclothing.shop',
    'business:contact_data:email': 'hello@bestyclothing.shop',
    'business:contact_data:phone_number': '+2349039456476',
    'business:contact_data:country_name': 'Nigeria',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.bestyclothing.shop/#organization',
      name: 'Besty Clothing',
      url: 'https://www.bestyclothing.shop',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bestyclothing.shop/besty-logo.png',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+234-903-945-6476',
        contactType: 'customer service',
        email: 'hello@bestyclothing.shop',
        areaServed: 'NG',
        availableLanguage: 'English',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.bestyclothing.shop/#website',
      url: 'https://www.bestyclothing.shop',
      name: 'Besty Clothing',
      publisher: { '@id': 'https://www.bestyclothing.shop/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.bestyclothing.shop/products?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ClothingStore',
      '@id': 'https://www.bestyclothing.shop/#store',
      name: 'Besty Clothing',
      url: 'https://www.bestyclothing.shop',
      description:
        'Authentic African fashion — ankara, kente, aso-oke and more, delivered across Nigeria.',
      image: 'https://www.bestyclothing.shop/besty-logo.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
      telephone: '+234-903-945-6476',
      email: 'hello@bestyclothing.shop',
      priceRange: '₦₦',
      currenciesAccepted: 'NGN',
      paymentAccepted: 'Credit Card, Debit Card',
      areaServed: 'NG',
      openingHours: 'Mo-Su 08:00-20:00',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.bestyclothing.shop' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://www.bestyclothing.shop/products' },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/besty-logo.png" />
        <link rel="shortcut icon" type="image/png" href="/besty-logo.png" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#1A0800" />
        <meta name="msapplication-TileColor" content="#1A0800" />
        <meta name="msapplication-TileImage" content="/besty-logo.png" />
        <meta name="msapplication-navbutton-color" content="#C9A227" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Besty Clothing" />
        <meta name="application-name" content="Besty Clothing" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="color-scheme" content="light" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="NG-LA" />
        <meta name="geo.placename" content="Lagos, Nigeria" />
        <meta name="geo.position" content="6.5244;3.3792" />
        <meta name="ICBM" content="6.5244, 3.3792" />
        <link rel="canonical" href="https://www.bestyclothing.shop" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-deep-brown antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  background: '#1A0800',
                  color: '#FBF7EF',
                  borderRadius: '0',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: { primary: '#C9A227', secondary: '#1A0800' },
                },
                error: {
                  iconTheme: { primary: '#8B1A2A', secondary: '#FBF7EF' },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
