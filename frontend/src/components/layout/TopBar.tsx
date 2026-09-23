'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, RefreshCw, HelpCircle, Store, ChevronDown } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-[#180e2b] text-gray-300 text-[11px] py-1.5 px-4 border-b border-[#2b184a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Value Badges */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-gray-200">
            <Truck className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold tracking-tight uppercase text-[10px]">FREE SHIPPING on orders over Rs. 2,999</span>
          </div>
          <span className="hidden sm:inline text-purple-800">|</span>
          <div className="flex items-center gap-1.5 text-gray-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-[11px]">100% Authentic Products</span>
          </div>
          <span className="hidden sm:inline text-purple-800">|</span>
          <div className="flex items-center gap-1.5 text-gray-200">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-[11px]">Easy Returns</span>
          </div>
        </div>

        {/* Right: Quick Links & Country Selector */}
        <div className="flex items-center gap-4 text-gray-300">
          <Link href="/faq" className="hover:text-white transition flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-purple-400" />
            <span>Help Center</span>
          </Link>
          <span className="text-purple-800">|</span>
          <a
            href="https://mall.thyaga.lk/sell-on-thyaga/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1"
          >
            <Store className="w-3 h-3 text-purple-400" />
            <span>Sell on Thayaga Mall</span>
          </a>
          <span className="text-purple-800">|</span>
          <div className="flex items-center gap-1.5 font-medium text-white cursor-pointer hover:text-purple-200">
            <span>🇱🇰 Sri Lanka | LKR</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
