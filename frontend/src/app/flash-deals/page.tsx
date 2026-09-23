'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Clock, Flame, ShoppingBag, ShieldCheck, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { FlashSale } from '@/types';
import { useCart } from '@/context/CartContext';

export default function FlashDealsPage() {
  const { addToCart } = useCart();
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    api.getActiveFlashSale().then((res) => {
      if (res.success && res.data) {
        setFlashSale(res.data);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!flashSale || !flashSale.end_time) return;

    const timer = setInterval(() => {
      const diff = +new Date(flashSale.end_time) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  const formatDigit = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#36135d]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-gray-800">Flash Deals Center</span>
      </div>

      {/* Hero Header with Animated Countdown */}
      <div className="bg-linear-to-r from-[#dc2626] via-[#b91c1c] to-[#991b1b] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-3 border border-white/20">
            <Flame className="w-4 h-4 fill-current" />
            <span>24H LIMITED TIME PROMOTION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
            ⚡ Mega Flash Sale Arena
          </h1>
          <p className="text-xs sm:text-sm text-red-100 leading-relaxed mb-6">
            Exclusive price drops on authentic Sri Lankan groceries, high-end electronics, home cookware, and beauty essentials. Limited stock available!
          </p>

          {/* Large Countdown Clock */}
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
            <Clock className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Deals Expire In:</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-white text-[#dc2626] font-black text-base px-2 py-1 rounded-md">
                {formatDigit(timeLeft.hours)}
              </span>
              <span className="font-bold text-white">:</span>
              <span className="bg-white text-[#dc2626] font-black text-base px-2 py-1 rounded-md">
                {formatDigit(timeLeft.minutes)}
              </span>
              <span className="font-bold text-white">:</span>
              <span className="bg-white text-[#dc2626] font-black text-base px-2 py-1 rounded-md">
                {formatDigit(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Icons in Background */}
        <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 pointer-events-none" />
      </div>

      {/* Assurance Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Free Shipping on Orders &gt; Rs. 2,999</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>100% Guaranteed Genuine Products</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Instant Order Dispatch</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Flame className="w-4 h-4 text-red-500 shrink-0" />
          <span>Up to 45% OFF Market Retail</span>
        </div>
      </div>

      {/* Flash Deals Catalog */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#dc2626] mb-2" />
          <span className="text-xs font-semibold">Loading current flash sale deals...</span>
        </div>
      ) : !flashSale || flashSale.items.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-gray-200">
          <h3 className="text-base font-bold text-gray-800 mb-1">No Active Flash Sale Right Now</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Stay tuned! Our next flash sale event is being prepared. Check back soon for massive discounts.
          </p>
          <Link
            href="/shop"
            className="bg-[#36135d] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition"
          >
            Browse Regular Store Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {flashSale.items.map((item) => {
            const product = item.product;
            if (!product) return null;

            const flashPrice = Number(item.flash_price);
            const regularPrice = Number(product.regular_price);
            const discountPercent = item.discount_percentage || Math.round(((regularPrice - flashPrice) / regularPrice) * 100);
            const percentSold = item.percentage_sold || 60;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-red-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-400 transition-all duration-300 flex flex-col justify-between group"
              >
                <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
                  <div className="relative w-full aspect-square bg-[#fffbfa] overflow-hidden">
                    <Image
                      src={product.primary_image || 'https://placehold.co/400x400/fff/dc2626?text=Flash+Deal'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#dc2626] text-white font-black text-xs px-2 py-0.5 rounded shadow-xs flex items-center gap-1 animate-pulse">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>-{discountPercent}%</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      {product.category && (
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#dc2626] transition mb-2">
                        {product.name}
                      </h3>

                      <div className="mb-2">
                        <div className="text-base font-black text-[#dc2626]">
                          Rs. {flashPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                          Rs. {regularPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    {/* Stock Claim Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                        <span className="text-gray-500">{item.quantity_sold} Sold</span>
                        <span className="text-red-600">{item.stock_remaining || 4} Left In Stock</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-amber-500 to-red-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-3.5 pt-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product, 1, flashPrice);
                    }}
                    className="w-full bg-[#dc2626] hover:bg-red-700 text-white py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim This Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
