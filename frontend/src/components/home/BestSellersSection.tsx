'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, ArrowRight, Heart, Award } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const BEST_SELLERS = [
  {
    id: 301,
    name: 'Sony WH-CH520 Wireless Headphones',
    slug: 'sony-wh-ch520-wireless',
    price: 18990,
    rating: 4.6,
    reviews: 430,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 302,
    name: 'Deerma Humidifier 5L Air Purifier',
    slug: 'deerma-humidifier-5l',
    price: 9990,
    rating: 4.5,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 303,
    name: 'Stainless Steel Insulated Lunch Box',
    slug: 'stainless-steel-lunch-box',
    price: 4990,
    rating: 4.7,
    reviews: 350,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 304,
    name: 'IKEA Modern Wooden Study Table',
    slug: 'ikea-study-table',
    price: 24990,
    rating: 4.5,
    reviews: 190,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 305,
    name: 'CeraVe Moisturizing Cream 454g',
    slug: 'cerave-moisturizing-cream',
    price: 7990,
    rating: 4.8,
    reviews: '1.5K',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 306,
    name: 'Black+Decker Cordless Drill Set',
    slug: 'black-decker-drill-set',
    price: 15990,
    rating: 4.6,
    reviews: 280,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
  },
];

export default function BestSellersSection() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('All');

  return (
    <section className="my-6 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-5">
      {/* Header with Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#36135d]" />
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight font-poppins">
              Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            {['All', 'Electronics', 'Home', 'Fashion', 'Beauty'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full transition cursor-pointer text-xs ${
                  activeTab === tab
                    ? 'bg-[#6d28d9] text-white font-bold shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900 bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/shop?sort=popular"
          className="text-xs font-bold text-[#6d28d9] hover:text-[#5b21b6] flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid of 6 Best Sellers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {BEST_SELLERS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
          >
            {/* Image */}
            <Link href={`/product/${item.slug}`} className="block relative aspect-square bg-[#fafafd] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            </Link>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1 justify-between">
              <div>
                <Link href={`/product/${item.slug}`}>
                  <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#36135d] transition mb-1.5 h-8">
                    {item.name}
                  </h3>
                </Link>

                <div className="text-sm font-black text-gray-900 mb-1.5">
                  Rs. {item.price.toLocaleString()}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-gray-800">{item.rating}</span>
                  <span className="text-gray-400">({item.reviews})</span>
                </div>
              </div>

              {/* Cart Icon Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    addToCart(
                      {
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        regular_price: item.price,
                        sale_price: null,
                        stock_quantity: 50,
                        primary_image: item.image,
                        is_active: true,
                      } as any,
                      1
                    );
                  }}
                  className="w-7 h-7 rounded-lg bg-purple-50 hover:bg-[#6d28d9] text-[#6d28d9] hover:text-white transition flex items-center justify-center cursor-pointer shadow-2xs"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
