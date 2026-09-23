'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Heart, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  flashPrice?: number;
}

export default function ProductCard({ product, flashPrice }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const regularPrice = Number(product.regular_price);
  const currentPrice = flashPrice !== undefined
    ? flashPrice
    : (product.sale_price ? Number(product.sale_price) : regularPrice);

  const discountPercent = flashPrice !== undefined
    ? Math.round(((regularPrice - flashPrice) / regularPrice) * 100)
    : product.discount_percentage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, flashPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const imageUrl = !imgError && product.primary_image
    ? product.primary_image
    : 'https://placehold.co/400x400/f3f4f6/36135d?text=Thyaga+Mall';

  return (
    <div className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between relative">
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
        {/* Thumbnail Container */}
        <div className="relative w-full aspect-square bg-[#fbfbfe] overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />

          {/* Discount Badge */}
          {discountPercent && discountPercent > 0 && (
            <div className={`absolute top-2.5 left-2.5 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-xs ${
              flashPrice !== undefined ? 'bg-[#dc2626] animate-pulse' : 'bg-[#a7144c]'
            }`}>
              {flashPrice !== undefined ? `⚡ -${discountPercent}%` : `-${discountPercent}%`}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition cursor-pointer ${
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-3.5 flex flex-col flex-1 justify-between">
          <div>
            {/* Category tag */}
            {product.category && (
              <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-wider block mb-1">
                {product.category.name}
              </span>
            )}

            {/* Product Title */}
            <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#36135d] transition mb-2">
              {product.name}
            </h3>

            {/* Ratings & Sold */}
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold text-gray-800 ml-1">{product.rating_avg}</span>
              </div>
              <span className="text-[11px] text-gray-400">({product.reviews_count || 12})</span>
            </div>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
            <div>
              <div className="text-sm font-black text-[#36135d]">
                Rs. {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              {(product.sale_price || flashPrice !== undefined) && regularPrice > currentPrice && (
                <div className="text-[11px] text-gray-400 line-through">
                  Rs. {regularPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAddToCart}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-100 text-[#36135d] hover:bg-[#36135d] hover:text-white'
              }`}
              title="Add to cart"
              aria-label="Add to cart"
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
