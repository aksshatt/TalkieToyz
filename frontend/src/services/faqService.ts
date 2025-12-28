import axios from '../config/axios';
import type {
  FaqsResponse,
  FaqResponse,
  FaqCategoriesResponse,
  Faq
} from '../types/faq';

export const faqService = {
  // Get all FAQs
  getFaqs: async (params?: { category?: string; q?: string }): Promise<FaqsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.q) queryParams.append('q', params.q);

    const response = await axios.get(`/faqs?${queryParams.toString()}`);
    return response.data;
  },

  // Get single FAQ
  getFaq: async (id: number): Promise<FaqResponse> => {
    const response = await axios.get(`/faqs/${id}`);
    return response.data;
  },

  // Get FAQ categories
  getCategories: async (): Promise<FaqCategoriesResponse> => {
    const response = await axios.get('/faqs/categories');
    return response.data;
  },

  // Admin: Create FAQ
  createFaq: async (faq: Partial<Faq>): Promise<FaqResponse> => {
    const response = await axios.post('/admin/faqs', { faq });
    return response.data;
  },

  // Admin: Update FAQ
  updateFaq: async (id: number, faq: Partial<Faq>): Promise<FaqResponse> => {
    const response = await axios.patch(`/admin/faqs/${id}`, { faq });
    return response.data;
  },

  // Admin: Delete FAQ
  deleteFaq: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/faqs/${id}`);
    return response.data;
  },

  // Admin: Get all FAQs (including inactive)
  getAdminFaqs: async (params?: {
    category?: string;
    active?: boolean;
    q?: string;
    page?: number;
    per_page?: number;
  }): Promise<FaqsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.active !== undefined) queryParams.append('active', String(params.active));
    if (params?.q) queryParams.append('q', params.q);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));

    const response = await axios.get(`/admin/faqs?${queryParams.toString()}`);
    return response.data;
  },
};
