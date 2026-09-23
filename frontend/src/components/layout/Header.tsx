'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { api } from '@/services/api';
import { Category } from '@/types';

export default function Header() {
  const router = useRouter();
  const { cartCount, openDrawer } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.append('search', searchTerm.trim());
    if (selectedCategory) query.append('category', selectedCategory);
    router.push(`/shop?${query.toString()}`);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Official Thyaga Mall Logo */}
        <Link href="/" className="shrink-0 flex items-center group">
          <Image
            src="/logo.png"
            alt="thyāga mall"
            width={170}
            height={86}
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Central Search Bar with Category Dropdown & Purple Button */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl relative hidden sm:flex items-center rounded-lg border border-gray-300 focus-within:border-[#36135d] focus-within:ring-1 focus-within:ring-[#36135d] bg-white transition p-0.5"
        >
          {/* Category Dropdown */}
          <div className="relative border-r border-gray-200 bg-transparent shrink-0 flex items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-semibold text-gray-600 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-hidden bg-transparent"
          />

          {/* Solid Deep Purple Search Button */}
          <button
            type="submit"
            className="bg-[#4a127a] hover:bg-[#36135d] text-white px-4 py-2.5 rounded-md transition flex items-center justify-center cursor-pointer shadow-xs"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Navigation Icons */}
        <div className="flex items-center gap-5 md:gap-7 shrink-0 text-gray-700">
          {/* Sign In / Account */}
          <Link
            href="/admin/login"
            className="flex items-center gap-2 hover:text-[#36135d] transition group"
          >
            <User className="w-5 h-5 text-gray-700 group-hover:text-[#36135d] transition" />
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-gray-400">Sign In</span>
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#36135d]">Account</span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link
            href="/shop"
            className="flex items-center gap-2 hover:text-[#36135d] transition group"
          >
            <div className="relative">
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-[#e11d48] transition" />
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-gray-400">Wishlist</span>
              <span className="text-xs font-bold text-gray-800">My Items</span>
            </div>
          </Link>

          {/* My Cart */}
          <button
            onClick={openDrawer}
            className="flex items-center gap-2 hover:text-[#36135d] transition group cursor-pointer"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-[#36135d] transition" />
              <span className="absolute -top-1.5 -right-2 bg-[#e11d48] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-gray-400">Shopping</span>
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#36135d]">My Cart</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center rounded-lg border border-gray-300 p-1 bg-white">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs text-gray-800 focus:outline-hidden"
          />
          <button type="submit" className="bg-[#4a127a] text-white p-2 rounded-md">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </header>
  );
}
