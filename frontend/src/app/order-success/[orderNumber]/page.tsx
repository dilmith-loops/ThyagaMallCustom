'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, Truck, Home, FileText, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { Order } from '@/types';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      api.getOrder(orderNumber).then((res) => {
        if (res.success) {
          setOrder(res.data);
        }
      }).finally(() => setIsLoading(false));
    }
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#36135d] mb-2" />
        <span className="text-xs font-semibold">Generating your order invoice...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 space-y-6">
      {/* Confirmation Box */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-1">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Your order has been placed and is currently being prepared for dispatch. A confirmation email has been sent to{' '}
          <strong className="text-gray-800">{order?.customer_email || 'your email'}</strong>.
        </p>

        {/* Tracking Pill */}
        <div className="bg-purple-50 border border-purple-200/80 rounded-xl p-4 inline-block text-left mb-6">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Order Tracking Number:
          </div>
          <div className="text-lg font-black text-[#36135d] tracking-wider">
            {orderNumber}
          </div>
        </div>

        {/* Order Details Grid */}
        {order && (
          <div className="border-t border-gray-100 pt-6 text-left text-xs space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Recipient Name:</span>
              <span className="font-bold text-gray-900">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Address:</span>
              <span className="font-bold text-gray-900">{order.shipping_address}, {order.shipping_city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-bold text-gray-900 uppercase">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Paid / Payable:</span>
              <span className="font-black text-sm text-[#36135d]">
                Rs. {Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#36135d] hover:bg-[#a7144c] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href={`/track-order?order_number=${orderNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Status</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
