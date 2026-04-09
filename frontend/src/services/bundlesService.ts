import axios from '../config/axios';

export interface Bundle {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  speech_goal: string | null;
  discount_percent: number;
  featured: boolean;
  original_price: number;
  discounted_price: number;
  savings: number;
  min_products: number;
  max_products: number;
  product_count: number;
  products: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
    stock_quantity: number;
    image_url: string | null;
  }>;
}

export const bundlesService = {
  getBundles: async (params?: { featured?: boolean; speech_goal?: string }) => {
    const response = await axios.get('/bundles', { params });
    return response.data;
  },

  getBundle: async (slug: string) => {
    const response = await axios.get(`/bundles/${slug}`);
    return response.data;
  },
};
