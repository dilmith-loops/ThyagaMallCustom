export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  products_count?: number;
  children?: Category[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number | null;
  brand_id: number | null;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  regular_price: number | string;
  sale_price: number | string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  rating_avg: number | string;
  reviews_count: number;
  is_featured: boolean;
  is_active: boolean;
  primary_image?: string;
  discount_percentage?: number | null;
  is_in_stock?: boolean;
  category?: Category;
  images?: ProductImage[];
}

export interface FlashSaleItem {
  id: number;
  flash_sale_id: number;
  product_id: number;
  flash_price: number | string;
  quantity_limit: number;
  quantity_sold: number;
  sort_order: number;
  discount_percentage?: number;
  stock_remaining?: number;
  percentage_sold?: number;
  product: Product;
}

export interface FlashSale {
  id: number;
  title: string;
  banner_url: string | null;
  start_time: string;
  end_time: string;
  is_active: boolean;
  is_currently_active?: boolean;
  items: FlashSaleItem[];
}

export interface Voucher {
  id: number;
  code: string;
  title: string;
  discount_amount: number | string;
  discount_type: 'fixed' | 'percentage';
  min_order_amount: number | string;
  max_discount: number | string | null;
  expires_at: string | null;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
}

export interface OrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  subtotal: number | string;
  discount: number | string;
  shipping_fee: number | string;
  total: number | string;
  voucher_code?: string | null;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  isFlashDeal?: boolean;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'super_admin' | 'manager' | 'editor';
  status: 'active' | 'suspended' | 'inactive';
  avatar?: string | null;
  last_login_at?: string | null;
  created_at?: string;
}

export interface CustomerUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'customer';
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  orders_count?: number;
  total_spent?: number;
}

export type ManagedUser = CustomerUser;

export interface ActivityLogItem {
  id: number;
  admin_id?: number | null;
  admin_name: string;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  description: string;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}
