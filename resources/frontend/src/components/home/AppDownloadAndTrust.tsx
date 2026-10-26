'use client';

import React from 'react';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  CreditCard,
  Headphones,
} from 'lucide-react';

export default function AppDownloadAndTrust() {
  return (
    <section className="my-6">
      {/* 5 Store Value Badges in a Row */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-2xs py-4.5 px-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* 1 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#6d28d9] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 leading-tight">Free Islandwide Shipping</h4>
            <p className="text-[10px] text-gray-500">Orders over Rs. 2,999</p>
          </div>
        </div>

        {/* 2 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#6d28d9] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 leading-tight">100% Authentic Products</h4>
            <p className="text-[10px] text-gray-500">From trusted brands</p>
          </div>
        </div>

        {/* 3 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#6d28d9] flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 leading-tight">Easy Returns</h4>
            <p className="text-[10px] text-gray-500">Hassle-free within 7 days</p>
          </div>
        </div>

        {/* 4 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#6d28d9] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 leading-tight">Secure Payments</h4>
            <p className="text-[10px] text-gray-500">Card, Wallets &amp; COD</p>
          </div>
        </div>

        {/* 5 */}
        <div className="flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-[#6d28d9] flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 leading-tight">Dedicated Support</h4>
            <p className="text-[10px] text-gray-500">We&apos;re here to help</p>
          </div>
        </div>
      </div>
    </section>
  );
}
