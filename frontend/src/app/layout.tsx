import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/common/Toast';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Thyaga Mall – Premier Online Shopping in Sri Lanka | Flash Deals & Vouchers',
  description: 'Shop authentic electronics, home essentials, beauty, and food products with Thyaga Gift Vouchers. Enjoy 24H flash deals and free islandwide shipping on orders over Rs. 2,999.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-gray-900 font-sans">
        <CartProvider>
          <TopBar />
          <Header />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
