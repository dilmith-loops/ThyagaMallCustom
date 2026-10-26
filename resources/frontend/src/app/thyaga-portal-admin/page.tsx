'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThyagaAdminPortalIndex() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('thyaga_admin_token') : null;
    if (token) {
      router.replace('/thyaga-portal-admin/dashboard');
    } else {
      router.replace('/thyaga-portal-admin/login');
    }
  }, [router]);

  return null;
}
