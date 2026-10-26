'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-300">
      <div className="bg-[#36135d] text-white px-4 py-3 rounded-lg shadow-xl border border-purple-400 flex items-center gap-3 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
