'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xs">
        <div className="w-16 h-16 bg-purple-50 text-[#36135d] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
          Your wishlist is currently empty. Explore our trending products, flash deals, and top categories to save your favorites!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#36135d] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2b0f4c] transition shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            Explore Shop
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/flash-deals"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
          >
            View Flash Deals
          </Link>
        </div>
      </div>
    </div>
  );
}
