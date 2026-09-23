import {
  Category,
  Product,
  FlashSale,
  Order,
  Admin,
  ManagedUser,
  ActivityLogItem,
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
    };
  }> {
    return fetcher('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
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
};
