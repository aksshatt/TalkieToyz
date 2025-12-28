import type { Product, ProductVariant } from './product';

export interface CartItem {
  id: number;
  product: Product;
  product_variant?: ProductVariant;
  quantity: number;
  item_price: string;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id: number;
  cart_items: CartItem[];
  subtotal: string;
  tax_amount: string;
  total: string;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message: string;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
  product_variant_id?: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
