import React, { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export function generateStaticParams() {
  return [
    { orderNumber: 'preview' },
  ];
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessClient />
    </Suspense>
  );
}
