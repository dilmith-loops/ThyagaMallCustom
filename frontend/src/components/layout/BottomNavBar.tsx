'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function BottomNavBar() {
  const pathname = usePathname();
  const { cartCount, openDrawer } = useCart();
  const { isAuthenticated } = useAuth();

  // Wishlist count (defaults to 0 or local storage count)
  const wishlistCount = 0;

  const isShopActive = pathname === '/' || pathname === '/shop' || pathname?.startsWith('/category') || pathname?.startsWith('/product');
  const isWishlistActive = pathname === '/wishlist';
  const isAccountActive = pathname === '/account' || pathname === '/login' || pathname === '/register';

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        {/* 1. Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 transition-colors select-none ${
            isShopActive ? 'text-[#36135d]' : 'text-[#262626] hover:text-[#36135d]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Store className="w-6 h-6 stroke-[1.8]" />
          </div>
          <span className={`text-[11px] mt-1 leading-none ${isShopActive ? 'font-semibold text-[#36135d]' : 'font-medium'}`}>
            Shop
          </span>
        </Link>

        {/* 2. Wishlist */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 transition-colors select-none ${
            isWishlistActive ? 'text-[#36135d]' : 'text-[#262626] hover:text-[#36135d]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Heart className="w-6 h-6 stroke-[1.8]" />
            <span className="absolute -top-1 -right-2 bg-[#2d114d] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-xs">
              {wishlistCount}
            </span>
          </div>
          <span className={`text-[11px] mt-1 leading-none ${isWishlistActive ? 'font-semibold text-[#36135d]' : 'font-medium'}`}>
            Wishlist
          </span>
        </Link>

        {/* 3. Cart */}
        <button
          type="button"
          onClick={openDrawer}
          className="flex flex-col items-center justify-center py-1 transition-colors select-none text-[#262626] hover:text-[#36135d] cursor-pointer"
          aria-label="Open Shopping Cart"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
            <span className="absolute -top-1 -right-2 bg-[#2d114d] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-xs">
              {cartCount}
            </span>
          </div>
          <span className="text-[11px] font-medium mt-1 leading-none">
            Cart
          </span>
        </button>

        {/* 4. My account */}
        <Link
          href={isAuthenticated ? '/account' : '/login'}
          className={`flex flex-col items-center justify-center py-1 transition-colors select-none ${
            isAccountActive ? 'text-[#36135d]' : 'text-[#262626] hover:text-[#36135d]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <User className="w-6 h-6 stroke-[1.8]" />
          </div>
          <span className={`text-[11px] mt-1 leading-none ${isAccountActive ? 'font-semibold text-[#36135d]' : 'font-medium'}`}>
            My account
          </span>
        </Link>
      </div>
    </nav>
  );
}
