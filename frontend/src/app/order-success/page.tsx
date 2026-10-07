import React, { Suspense } from 'react';
import OrderSuccessClient from './[orderNumber]/OrderSuccessClient';

export default function OrderSuccessGeneralPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessClient />
    </Suspense>
  );
}
