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
  title: 'Besty Clothing — African Fashion',
  description:
    'Authentic African fashion — stunning ankara, kente, aso-oke and more. Shop the finest handcrafted African clothing delivered across Nigeria.',
  keywords: ['african fashion', 'ankara', 'kente', 'aso-oke', 'nigerian clothing', 'besty clothing'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
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
