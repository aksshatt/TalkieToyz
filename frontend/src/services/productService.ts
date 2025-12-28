import axios from '../config/axios';
import type {
  ProductsResponse,
  ProductResponse,
  ProductFilters,
  Category,
  SpeechGoal
} from '../types/product';

export const productService = {
  // Get all products with filters
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by slug
  getProduct: async (slug: string): Promise<ProductResponse> => {
    const response = await axios.get(`/products/${slug}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (slug: string): Promise<ProductsResponse> => {
    const response = await axios.get(`/products/${slug}/related`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await axios.get('/categories');
    return response.data;
  },

  // Get all speech goals
  getSpeechGoals: async (): Promise<{ success: boolean; data: SpeechGoal[] }> => {
    const response = await axios.get('/speech_goals');
    return response.data;
  },
};
