'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '@/services/api';
import { Category } from '@/types';

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMegaOpen, setIsMegaOpen] = useState(false);

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    }).catch(() => {});
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Solid Dark Purple "All Categories" button */}
          <div
            className="relative"
            onMouseEnter={() => setIsMegaOpen(true)}
            onMouseLeave={() => setIsMegaOpen(false)}
          >
            <button
              onClick={() => setIsMegaOpen(!isMegaOpen)}
              className="bg-[#240d42] hover:bg-[#36135d] text-white px-5 py-2.5 rounded-t-lg font-bold text-xs tracking-wider flex items-center gap-3 transition cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {/* Flyout Category Menu */}
            {isMegaOpen && (
              <div className="absolute top-full left-0 w-64 bg-white text-gray-800 shadow-2xl border border-gray-200 rounded-b-xl py-2 flex flex-col z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-700 hover:text-[#36135d] hover:bg-purple-50 transition"
                    onClick={() => setIsMegaOpen(false)}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Horizontal Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-semibold text-gray-700">
            <Link href="/" className="text-[#36135d] font-bold hover:text-[#e11d48] transition">
              Home
            </Link>
            <Link href="/flash-deals" className="hover:text-[#e11d48] transition">
              Today&apos;s Deals
            </Link>
            <Link href="/shop?sort=newest" className="hover:text-[#e11d48] transition">
              New Arrivals
            </Link>
            <Link href="/shop?category=electronics" className="hover:text-[#e11d48] transition">
              Electronics
            </Link>
            <Link href="/shop?category=home" className="hover:text-[#e11d48] transition">
              Home &amp; Kitchen
            </Link>
            <Link href="/shop?category=fashion" className="hover:text-[#e11d48] transition">
              Fashion
            </Link>
            <Link href="/shop?category=beauty" className="hover:text-[#e11d48] transition">
              Beauty &amp; Care
            </Link>
            <Link href="/shop?category=food" className="hover:text-[#e11d48] transition">
              Groceries
            </Link>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#e11d48] transition">
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Right Nav CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/flash-deals"
            className="flex items-center gap-1.5 text-xs font-black text-[#e11d48] hover:text-[#be123c] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition"
          >
            <span className="animate-pulse">⚡</span>
            <span>Flash Deals</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
