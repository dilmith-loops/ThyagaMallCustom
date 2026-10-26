import React from 'react';
import ProductClient from './ProductClient';
import productSlugs from '@/data/product-slugs.json';

export function generateStaticParams() {
  return productSlugs.map((slug: string) => ({
    slug,
  }));
}

export default function ProductDetailPage() {
  return <ProductClient />;
}
