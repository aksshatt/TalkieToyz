import type { Product, ProductVariant } from './product';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'razorpay' | 'cod';

export type PaymentStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface OrderItem {
  id: number;
  order_id: number;
  product: Product;
  product_variant?: ProductVariant;
  quantity: number;
  unit_price: string;
  total_price: string;
  product_snapshot: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_intent_id?: string;
  payment_details?: Record<string, any>;
  subtotal: string;
  tax: string;
  shipping_cost: string;
  discount: string;
  total: string;
  shipping_address: Address;
  billing_address: Address;
  tracking_number?: string;
  notes?: string;
  cancelled_at?: string;
  cancelled_reason?: string;
  order_items: OrderItem[];
  coupon_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CreateOrderData {
  payment_method: PaymentMethod;
  shipping_address: Address;
  billing_address?: Address;
  coupon_code?: string;
  notes?: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  message: string;
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message: string;
}

export interface RazorpayOrderResponse {
  order: Order;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  min_order_amount: string;
  max_discount_amount?: string;
  valid_from?: string;
  valid_until?: string;
  usage_limit: number;
  usage_count: number;
  active: boolean;
  description?: string;
}

export interface ValidateCouponData {
  code: string;
  order_amount: number;
}

export interface ValidateCouponResponse {
  success: boolean;
  data: {
    valid: boolean;
    coupon?: Coupon;
    discount?: number;
    message?: string;
  };
  message: string;
}
