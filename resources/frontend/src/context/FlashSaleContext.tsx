'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { FlashSale } from '@/types';

interface FlashSaleContextType {
  flashSale: FlashSale | null;
  isActive: boolean;
  isLoading: boolean;
  refreshFlashSale: () => Promise<void>;
}

const FlashSaleContext = createContext<FlashSaleContextType>({
  flashSale: null,
  isActive: false,
  isLoading: true,
  refreshFlashSale: async () => {},
});

export function FlashSaleProvider({ children }: { children: React.ReactNode }) {
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlashSale = useCallback(async () => {
    try {
      const res = await api.getActiveFlashSale();
      if (res.success && res.data && res.data.is_active && res.data.items && res.data.items.length > 0) {
        const endMs = res.data.end_time ? new Date(res.data.end_time).getTime() : 0;
        if (endMs === 0 || endMs > Date.now()) {
          setFlashSale(res.data);
          return;
        }
      }
      setFlashSale(null);
    } catch {
      setFlashSale(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlashSale();
  }, [fetchFlashSale]);

  const isActive = Boolean(
    flashSale &&
    flashSale.is_active &&
    flashSale.items &&
    flashSale.items.length > 0 &&
    (!flashSale.end_time || new Date(flashSale.end_time).getTime() > Date.now())
  );

  return (
    <FlashSaleContext.Provider
      value={{
        flashSale,
        isActive,
        isLoading,
        refreshFlashSale: fetchFlashSale,
      }}
    >
      {children}
    </FlashSaleContext.Provider>
  );
}

export function useFlashSale() {
  return useContext(FlashSaleContext);
}
