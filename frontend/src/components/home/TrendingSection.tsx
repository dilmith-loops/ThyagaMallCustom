'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const TRENDING_ITEMS = [
  {
    id: 201,
    name: 'Apple AirPods Pro 2',
    slug: 'apple-airpods-pro-2',
    price: 69990,
    rating: 4.9,
    reviews: 532,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 202,
    name: 'Nike Running Shoes',
    slug: 'nike-running-shoes',
    price: 19990,
    rating: 4.6,
    reviews: '1.2K',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 203,
    name: 'LEGO Classic Creative Set',
    slug: 'lego-classic-set',
    price: 8990,
    rating: 4.7,
    reviews: 380,
    image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 204,
    name: 'Acer Aspire Laptop 15.6"',
    slug: 'acer-aspire-laptop',
    price: 129990,
    rating: 4.5,
    reviews: 820,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 205,
    name: 'Zalia Floral Women\'s Dress',
    slug: 'zalia-womens-dress',
    price: 12990,
    rating: 4.8,
    reviews: 910,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 206,
    name: 'Tefal EasyGliss Steam Iron',
    slug: 'tefal-steam-iron',
    price: 17990,
    rating: 4.7,
    reviews: 360,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=400&q=80',
  },
];

export default function TrendingSection() {
  const { addToCart } = useCart();

  return (
    <section className="my-6 bg-white rounded-xl border border-gray-200 shadow-2xs p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">💥</span>
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight font-poppins flex items-center gap-1.5">
            <span>Trending Right Now</span>
            <span>🔥</span>
          </h2>
        </div>

        <Link
          href="/shop?sort=popular"
          className="text-xs font-bold text-[#6d28d9] hover:text-[#5b21b6] flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid of 6 items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {TRENDING_ITEMS.map((item) => (
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

              {/* Cart Icon Button on Right */}
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
