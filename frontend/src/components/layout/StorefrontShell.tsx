'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/common/Toast';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/thyaga-portal-admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Header />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
