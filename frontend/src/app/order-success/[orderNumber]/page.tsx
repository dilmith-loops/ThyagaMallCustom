import React from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export function generateStaticParams() {
  return [
    { orderNumber: '[orderNumber]' },
    { orderNumber: 'preview' },
  ];
}

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
