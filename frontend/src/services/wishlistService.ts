import axios from '../config/axios';

export const wishlistService = {
  getWishlist: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await axios.get('/wishlists');
    return response.data;
  },

  addToWishlist: async (productId: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post('/wishlists', { product_id: productId });
    return response.data;
  },

  removeFromWishlist: async (productId: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/wishlists/${productId}`);
    return response.data;
  },

  isWishlisted: async (productId: number): Promise<{ success: boolean; data: { wishlisted: boolean } }> => {
    const response = await axios.get(`/wishlists/${productId}/check`);
    return response.data;
  },
};
