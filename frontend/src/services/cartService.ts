import axiosInstance from '../config/axios';
import type {
  CartResponse,
  AddToCartData,
  UpdateCartItemData,
} from '../types/cart';

const cartService = {
  /**
   * Get current user's cart
   */
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  addItem: async (data: AddToCartData): Promise<CartResponse> => {
    const response = await axiosInstance.post('/cart/items', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (
    itemId: number,
    data: UpdateCartItemData
  ): Promise<CartResponse> => {
    const response = await axiosInstance.patch(`/cart/items/${itemId}`, data);
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: number): Promise<CartResponse> => {
    const response = await axiosInstance.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
  },
};

export default cartService;
