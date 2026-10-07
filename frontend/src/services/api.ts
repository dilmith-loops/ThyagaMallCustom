import {
  Category,
  Product,
  FlashSale,
  Order,
  Admin,
  ManagedUser,
  Merchant,
  NewsletterSubscriber,
  ActivityLogItem,
  CustomerAuthUser,
  CustomerAuthResponse,
  ThyagaVoucherDetails,
  ThyagaRedemption,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store', // dynamic for ecommerce freshness
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json;
}

// Public API
export const api = {
  // Customer Authentication APIs
  async customerRegister(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }): Promise<CustomerAuthResponse> {
    return fetcher('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async customerLogin(data: {
    email: string;
    password: string;
  }): Promise<CustomerAuthResponse> {
    return fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async customerGetMe(token: string): Promise<{ success: boolean; user: CustomerAuthUser }> {
    return fetcher('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async customerGetOrders(token: string): Promise<{
    success: boolean;
    data: any[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    return fetcher('/user/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async customerLogout(token: string): Promise<{ success: boolean; message: string }> {
    return fetcher('/user/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  // Categories
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    return fetcher('/categories');
  },

  async getCategory(slug: string): Promise<{ success: boolean; data: Category }> {
    return fetcher(`/categories/${slug}`);
  },

  // Products
  async getProducts(params: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
    page?: number;
    per_page?: number;
    featured?: boolean;
  } = {}): Promise<{
    success: boolean;
    data: Product[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.min_price) query.append('min_price', params.min_price.toString());
    if (params.max_price) query.append('max_price', params.max_price.toString());
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());
    if (params.featured) query.append('featured', '1');

    const qs = query.toString();
    return fetcher(`/products${qs ? `?${qs}` : ''}`);
  },

  async getFeaturedProducts(): Promise<{ success: boolean; data: Product[] }> {
    return fetcher('/products/featured');
  },

  async getProduct(slug: string): Promise<{
    success: boolean;
    data: {
      product: Product;
      related: Product[];
    };
  }> {
    return fetcher(`/products/${slug}`);
  },

  // Flash Sale
  async getActiveFlashSale(): Promise<{ success: boolean; data: FlashSale | null }> {
    return fetcher('/flash-sale/active');
  },

  // Voucher
  async applyVoucher(code: string, subtotal: number): Promise<{
    success: boolean;
    data: {
      code: string;
      title: string;
      discount: number;
      new_total: number;
    };
    message: string;
  }> {
    return fetcher('/vouchers/apply', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  // Thyāga (GYF) Gift Voucher API
  async getThyagaVoucherDetails(code: string): Promise<{
    success: boolean;
    data?: ThyagaVoucherDetails;
    message: string;
    error_code?: string;
  }> {
    return fetcher(`/vouchers/thyaga/details/${encodeURIComponent(code)}`);
  },

  async initiateThyagaRedemption(voucherId: string, amount: number): Promise<{
    success: boolean;
    data?: { redemptionId: string; status: string };
    message: string;
    error_code?: string;
  }> {
    return fetcher('/vouchers/thyaga/initiate', {
      method: 'POST',
      body: JSON.stringify({ voucher_id: voucherId, amount }),
    });
  },

  async verifyThyagaOtp(redemptionId: string, amount: number, otp: string): Promise<{
    success: boolean;
    data?: { redemptionId: string; status: string; amount: number };
    message: string;
    error_code?: string;
  }> {
    return fetcher('/vouchers/thyaga/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ redemption_id: redemptionId, amount, otp }),
    });
  },

  async cancelThyagaRedemption(redemptionId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return fetcher('/vouchers/thyaga/cancel', {
      method: 'POST',
      body: JSON.stringify({ redemption_id: redemptionId }),
    });
  },

  // Newsletter
  async subscribeNewsletter(email: string, source: string = 'home_banner'): Promise<{
    success: boolean;
    message: string;
    already_subscribed?: boolean;
    data: NewsletterSubscriber;
  }> {
    return fetcher('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    });
  },

  // Orders
  async createOrder(orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code?: string;
    items: { product_id: number; quantity: number }[];
    voucher_code?: string;
    voucher_redemption_id?: string;
    voucher_owner_name?: string;
    voucher_amount?: number;
    payment_method: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      order_id: number;
      order_number: string;
      total: number;
      shipping_fee: number;
      discount: number;
      order_status: string;
      payment_method?: string;
      payment_status?: string;
      payment_url?: string;
      payment_params?: Record<string, string>;
      redirect_required?: boolean;
    };
  }> {
    return fetcher('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async initiateWebxpay(orderNumber: string): Promise<{
    success: boolean;
    data: {
      gateway_url: string;
      params: Record<string, string>;
      order_number: string;
      total: number;
    };
  }> {
    return fetcher(`/payment/webxpay/initiate/${orderNumber}`, {
      method: 'POST',
    });
  },

  async getOrder(orderNumber: string): Promise<{ success: boolean; data: Order }> {
    return fetcher(`/orders/${orderNumber}`);
  },

  // Admin APIs
  async adminLogin(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    token: string;
    admin: Admin;
  }> {
    return fetcher('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getAdminStats(token: string): Promise<{
    success: boolean;
    data: {
      total_sales: number;
      total_orders: number;
      pending_orders: number;
      total_products: number;
      low_stock_products: number;
      active_flash_sales: number;
      recent_orders: Order[];
      top_categories: Category[];
    };
  }> {
    return fetcher('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminProducts(token: string, params: {
    page?: number;
    search?: string;
    category_id?: number;
    merchant_id?: number;
    stock_status?: string;
    per_page?: number;
  } = {}): Promise<{
    success: boolean;
    data: Product[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.search) query.append('search', params.search);
    if (params.category_id) query.append('category_id', params.category_id.toString());
    if (params.merchant_id) query.append('merchant_id', params.merchant_id.toString());
    if (params.stock_status) query.append('stock_status', params.stock_status);
    if (params.per_page) query.append('per_page', params.per_page.toString());

    const qs = query.toString();
    return fetcher(`/admin/products${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createAdminProduct(token: string, data: Partial<Product> & { image_url?: string }): Promise<{
    success: boolean;
    message: string;
    data: Product;
  }> {
    return fetcher('/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async updateAdminProduct(token: string, id: number, data: Partial<Product> & { image_url?: string }): Promise<{
    success: boolean;
    message: string;
    data: Product;
  }> {
    return fetcher(`/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async deleteAdminProduct(token: string, id: number): Promise<{ success: boolean; message: string }> {
    return fetcher(`/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async exportAdminProductsCsv(token: string, params: {
    category_id?: number;
    merchant_id?: number;
    search?: string;
  } = {}): Promise<Blob> {
    const query = new URLSearchParams();
    if (params.category_id) query.append('category_id', params.category_id.toString());
    if (params.merchant_id) query.append('merchant_id', params.merchant_id.toString());
    if (params.search) query.append('search', params.search);
    const qs = query.toString();

    const res = await fetch(`${API_BASE}/admin/products/export${qs ? `?${qs}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Export failed with status ${res.status}`);
    }
    return res.blob();
  },

  async getAdminProductsSampleTemplate(): Promise<Blob> {
    const res = await fetch(`${API_BASE}/admin/products/template`);
    if (!res.ok) {
      throw new Error(`Template download failed with status ${res.status}`);
    }
    return res.blob();
  },

  async importAdminProducts(token: string, file: File, updateExisting: boolean = false): Promise<{
    success: boolean;
    message: string;
    imported: number;
    updated: number;
    skipped: number;
    errors?: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('update_existing', updateExisting ? '1' : '0');

    const res = await fetch(`${API_BASE}/admin/products/import`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.message || 'Product import failed');
    }
    return json;
  },

  async importAdminProductsJson(token: string, products: any[], updateExisting: boolean = false): Promise<{
    success: boolean;
    message: string;
    imported: number;
    updated: number;
    skipped: number;
    errors?: string[];
  }> {
    return fetcher('/admin/products/import', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ products, update_existing: updateExisting }),
    });
  },

  // Merchant Management Methods
  async getAdminMerchants(token: string, params: {
    page?: number;
    search?: string;
    status?: string;
    sort_by?: string;
    per_page?: number | string;
    all?: boolean;
  } = {}): Promise<{
    success: boolean;
    stats: {
      total_merchants: number;
      active_merchants: number;
      pending_merchants: number;
      inactive_merchants: number;
      total_assigned_products: number;
      avg_commission: number;
    };
    data: Merchant[];
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.per_page) query.append('per_page', params.per_page.toString());
    if (params.all) query.append('all', 'true');

    const qs = query.toString();
    return fetcher(`/admin/merchants${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminMerchant(token: string, id: number): Promise<{
    success: boolean;
    data: Merchant;
  }> {
    return fetcher(`/admin/merchants/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createAdminMerchant(token: string, data: Partial<Merchant>): Promise<{
    success: boolean;
    message: string;
    data: Merchant;
  }> {
    return fetcher('/admin/merchants', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async updateAdminMerchant(token: string, id: number, data: Partial<Merchant>): Promise<{
    success: boolean;
    message: string;
    data: Merchant;
  }> {
    return fetcher(`/admin/merchants/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async deleteAdminMerchant(token: string, id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    return fetcher(`/admin/merchants/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async toggleAdminMerchantStatus(token: string, id: number, status?: string): Promise<{
    success: boolean;
    message: string;
    data: Merchant;
  }> {
    return fetcher(`/admin/merchants/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  async getAdminMerchantProducts(token: string, id: number, params: { page?: number; per_page?: number } = {}): Promise<{
    success: boolean;
    merchant: { id: number; name: string; code: string | null; logo_url: string | null };
    data: Product[];
    pagination: { current_page: number; last_page: number; total: number };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.per_page) query.append('per_page', params.per_page.toString());
    const qs = query.toString();
    return fetcher(`/admin/merchants/${id}/products${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminFlashSales(token: string): Promise<{ success: boolean; data: FlashSale[] }> {
    return fetcher('/admin/flash-sales', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateAdminFlashSale(token: string, id: number, data: Partial<FlashSale>): Promise<{
    success: boolean;
    message: string;
    data: FlashSale;
  }> {
    return fetcher(`/admin/flash-sales/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async addAdminFlashSaleItem(token: string, flashSaleId: number, itemData: {
    product_id: number;
    flash_price: number;
    quantity_limit: number;
  }): Promise<{ success: boolean; message: string }> {
    return fetcher(`/admin/flash-sales/${flashSaleId}/items`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(itemData),
    });
  },

  async removeAdminFlashSaleItem(token: string, flashSaleId: number, itemId: number): Promise<{ success: boolean; message: string }> {
    return fetcher(`/admin/flash-sales/${flashSaleId}/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminOrders(token: string, params: { status?: string; search?: string; page?: number } = {}): Promise<{
    success: boolean;
    data: Order[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());

    const qs = query.toString();
    return fetcher(`/admin/orders${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateAdminOrderStatus(token: string, id: number, status: string): Promise<{
    success: boolean;
    message: string;
    data: Order;
  }> {
    return fetcher(`/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ order_status: status }),
    });
  },

  async getAdminUsers(token: string, params: {
    page?: number;
    role?: string;
    status?: string;
    search?: string;
  } = {}): Promise<{
    success: boolean;
    data: ManagedUser[];
    stats: {
      total_users: number;
      total_admins: number;
      total_customers: number;
      active_users: number;
    };
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return fetcher(`/admin/users${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createAdminUser(token: string, data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    password?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: ManagedUser;
  }> {
    return fetcher('/admin/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async updateAdminUser(token: string, id: number, data: Partial<ManagedUser> & { password?: string }): Promise<{
    success: boolean;
    message: string;
    data: ManagedUser;
  }> {
    return fetcher(`/admin/users/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async deleteAdminUser(token: string, id: number): Promise<{ success: boolean; message: string }> {
    return fetcher(`/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminStaff(token: string, params: {
    page?: number;
    role?: string;
    status?: string;
    search?: string;
  } = {}): Promise<{
    success: boolean;
    data: Admin[];
    stats: {
      total_admins: number;
      super_admins: number;
      managers: number;
      editors: number;
      active_admins: number;
    };
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return fetcher(`/admin/admins${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createAdminStaff(token: string, data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    password?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: Admin;
  }> {
    return fetcher('/admin/admins', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async updateAdminStaff(token: string, id: number, data: Partial<Admin> & { password?: string }): Promise<{
    success: boolean;
    message: string;
    data: Admin;
  }> {
    return fetcher(`/admin/admins/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async deleteAdminStaff(token: string, id: number): Promise<{ success: boolean; message: string }> {
    return fetcher(`/admin/admins/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminActivityLogs(token: string, params: {
    page?: number;
    action?: string;
    search?: string;
  } = {}): Promise<{
    success: boolean;
    data: ActivityLogItem[];
    stats: {
      total_activities: number;
      today_activities: number;
      unique_admins: number;
      auth_events: number;
    };
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.action) query.append('action', params.action);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return fetcher(`/admin/activity-logs${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin Newsletter Subscribers Management
  async getAdminNewsletterSubscribers(token: string, params: {
    page?: number;
    search?: string;
    status?: string;
    source?: string;
    sort_by?: string;
    per_page?: number;
    all?: boolean;
  } = {}): Promise<{
    success: boolean;
    stats: {
      total_subscribers: number;
      active_subscribers: number;
      unsubscribed_subscribers: number;
      recent_subscribers_7d: number;
    };
    data: NewsletterSubscriber[];
    pagination?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.source) query.append('source', params.source);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.per_page) query.append('per_page', params.per_page.toString());
    if (params.all) query.append('all', 'true');

    const qs = query.toString();
    return fetcher(`/admin/newsletter-subscribers${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createAdminNewsletterSubscriber(token: string, data: {
    email: string;
    status?: 'subscribed' | 'unsubscribed';
    source?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: NewsletterSubscriber;
  }> {
    return fetcher('/admin/newsletter-subscribers', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  },

  async toggleAdminNewsletterSubscriberStatus(token: string, id: number, status?: string): Promise<{
    success: boolean;
    message: string;
    data: NewsletterSubscriber;
  }> {
    return fetcher(`/admin/newsletter-subscribers/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  async deleteAdminNewsletterSubscriber(token: string, id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    return fetcher(`/admin/newsletter-subscribers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
