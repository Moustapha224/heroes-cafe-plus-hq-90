// Custom types for the ordering system

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'completed' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'mobile_money' | 'card';
export type AppRole = 'admin' | 'user';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  order_type: OrderType;
  payment_method: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface CartItem extends OrderItem {
  product: Product;
}
