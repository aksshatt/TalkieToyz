import axios from '../config/axios';

// Dashboard Types
export interface DashboardStats {
  overview: {
    total_sales: number;
    total_orders: number;
    total_customers: number;
    total_products: number;
    pending_orders: number;
    orders_today: number;
    revenue_today: number;
    average_order_value: number;
  };
  recent_orders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
  }>;
  top_products: Array<{
    product_id: number;
    product_name: string;
    units_sold: number;
    revenue: number;
  }>;
  revenue: {
    last_7_days: Array<{
      date: string;
      revenue: number;
    }>;
    current_month: number;
    last_month: number;
    growth_percentage: number;
  };
}

// Product Types
export interface AdminProduct {
  id: number;
  name: string;
  sku?: string;
  price: number;
  compare_at_price?: number | null;
  stock_quantity: number;
  category: string | { id: number; name: string; [key: string]: any };
  active: boolean;
  featured?: boolean;
  description?: string;
  long_description?: string;
  min_age?: number | null;
  max_age?: number | null;
  created_at: string;
  total_sold?: number;
  image_url?: string;
  image_urls?: Array<{ id: number; url: string }>;
}

export interface AdminProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: AdminProduct[];
    meta?: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  };
}

// Order Types
export interface AdminOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  items_count?: number;
  created_at: string;
  shipping_address?: {
    name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
  };
  items?: Array<{
    id: number;
    product_name?: string;
    item_name?: string;
    quantity: number;
    price?: number;
    unit_price?: number;
    total?: number;
    total_price?: number;
  }>;
}

export interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: AdminOrder[];
    meta?: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  };
}

// Customer Types
export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  last_order_at?: string;
  orders?: Array<{
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    payment_status?: string;
  }>;
}

export interface AdminCustomersResponse {
  success: boolean;
  message: string;
  data: {
    customers: AdminCustomer[];
    meta?: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  };
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface AdminSuccessStory {
  id: number;
  child_name: string;
  age_months: number;
  speech_goal: string;
  before_text: string;
  after_text: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
  user: { id: number; name: string; email: string };
  product: { id: number; name: string; slug: string } | null;
}

export interface AdminProductQuestion {
  id: number;
  question: string;
  answer: string | null;
  approved: boolean;
  answered: boolean;
  answered_at: string | null;
  created_at: string;
  product: { id: number; name: string; slug: string };
  user: { id: number; name: string; email: string };
  answered_by: { id: number; name: string } | null;
}

export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats; message: string }> => {
    const response = await axios.get('/admin/dashboard');
    return response.data;
  },

  // Products
  getProducts: async (filters?: {
    page?: number;
    per_page?: number;
    active?: boolean;
    category_id?: number;
    featured?: boolean;
    low_stock?: number;
    search?: string;
  }): Promise<AdminProductsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(`/admin/products${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  getProduct: async (id: number): Promise<{ success: boolean; data: AdminProduct; message: string }> => {
    const response = await axios.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (product: any, images?: File[]): Promise<{ success: boolean; data: AdminProduct; message: string }> => {
    if (images && images.length > 0) {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`product[${key}]`, String(value));
        }
      });
      images.forEach((image) => {
        formData.append('product[images][]', image);
      });
      const response = await axios.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await axios.post('/admin/products', { product });
    return response.data;
  },

  updateProduct: async (id: number, product: any, images?: File[], removeImageIds?: number[]): Promise<{ success: boolean; data: AdminProduct; message: string }> => {
    if ((images && images.length > 0) || (removeImageIds && removeImageIds.length > 0)) {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`product[${key}]`, String(value));
        }
      });
      if (images) {
        images.forEach((image) => {
          formData.append('product[images][]', image);
        });
      }
      if (removeImageIds) {
        removeImageIds.forEach((imgId) => {
          formData.append('remove_image_ids[]', String(imgId));
        });
      }
      const response = await axios.patch(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await axios.patch(`/admin/products/${id}`, { product });
    return response.data;
  },

  deleteProduct: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Orders
  getOrders: async (filters?: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    payment_method?: string;
    user_id?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
    min_amount?: number;
    max_amount?: number;
  }): Promise<AdminOrdersResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(`/admin/orders${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  getOrder: async (id: number): Promise<{ success: boolean; data: AdminOrder; message: string }> => {
    const response = await axios.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string, notes?: string): Promise<{ success: boolean; data: AdminOrder; message: string }> => {
    const response = await axios.patch(`/admin/orders/${id}/update_status`, { status, notes });
    return response.data;
  },

  createShipment: async (id: number, courier_id?: number): Promise<any> => {
    const response = await axios.post(`/admin/orders/${id}/create_shipment`, courier_id ? { courier_id } : {});
    return response.data;
  },

  cancelShipment: async (id: number): Promise<any> => {
    const response = await axios.post(`/admin/orders/${id}/cancel_shipment`);
    return response.data;
  },

  getShippingLabel: async (id: number): Promise<any> => {
    const response = await axios.get(`/admin/orders/${id}/shipping_label`);
    return response.data;
  },

  createReturn: async (id: number): Promise<any> => {
    const response = await axios.post(`/admin/orders/${id}/create_return`);
    return response.data;
  },

  refundOrder: async (id: number, amount?: number, reason?: string): Promise<any> => {
    const response = await axios.post(`/admin/orders/${id}/refund`, { amount, reason });
    return response.data;
  },

  // Customers
  getCustomers: async (filters?: {
    page?: number;
    per_page?: number;
    search?: string;
    has_orders?: boolean;
    date_from?: string;
    date_to?: string;
  }): Promise<AdminCustomersResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(`/admin/customers${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  getCustomer: async (id: number): Promise<{ success: boolean; data: AdminCustomer; message: string }> => {
    const response = await axios.get(`/admin/customers/${id}`);
    return response.data;
  },

  updateCustomer: async (id: number, customer: any): Promise<{ success: boolean; data: AdminCustomer; message: string }> => {
    const response = await axios.patch(`/admin/customers/${id}`, { customer });
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/customers/${id}`);
    return response.data;
  },

  // Success Stories
  getSuccessStories: async (filters?: {
    page?: number;
    per_page?: number;
    approved?: boolean;
    featured?: boolean;
    q?: string;
  }): Promise<{ success: boolean; message: string; data: { success_stories: AdminSuccessStory[]; meta: PaginationMeta } }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(`/admin/success_stories${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  approveStory: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`/admin/success_stories/${id}/approve`);
    return response.data;
  },

  rejectStory: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`/admin/success_stories/${id}/reject`);
    return response.data;
  },

  featureStory: async (id: number): Promise<{ success: boolean; message: string; data: AdminSuccessStory }> => {
    const response = await axios.post(`/admin/success_stories/${id}/feature`);
    return response.data;
  },

  deleteStory: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/success_stories/${id}`);
    return response.data;
  },

  // Product Questions
  getProductQuestions: async (filters?: {
    page?: number;
    per_page?: number;
    approved?: boolean;
    answered?: boolean;
    product_id?: number;
    q?: string;
  }): Promise<{ success: boolean; message: string; data: { product_questions: AdminProductQuestion[]; meta: PaginationMeta } }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(`/admin/product_questions${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  approveQuestion: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`/admin/product_questions/${id}/approve`);
    return response.data;
  },

  rejectQuestion: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`/admin/product_questions/${id}/reject`);
    return response.data;
  },

  answerQuestion: async (id: number, answer: string): Promise<{ success: boolean; message: string; data: AdminProductQuestion }> => {
    const response = await axios.patch(`/admin/product_questions/${id}/answer`, { answer });
    return response.data;
  },

  deleteQuestion: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/product_questions/${id}`);
    return response.data;
  },

  // Orders export
  exportOrders: async (filters?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(
      `/admin/orders/export${params.toString() ? `?${params.toString()}` : ''}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Coupons
  getCoupons: async (filters?: { page?: number; per_page?: number; q?: string; active?: string }): Promise<{ success: boolean; message: string; data: { coupons: any[]; meta: PaginationMeta } }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await axios.get(`/admin/coupons${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  bulkGenerateCoupons: async (params: {
    count: number;
    prefix?: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    usage_limit?: number;
    valid_from?: string;
    valid_until?: string;
  }): Promise<{ success: boolean; message: string; data: { generated: any[]; errors: any[]; total_generated: number } }> => {
    const response = await axios.post('/admin/coupons/bulk_generate', params);
    return response.data;
  },

  deleteCoupon: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  toggleCoupon: async (id: number): Promise<{ success: boolean; message: string; data: any }> => {
    const response = await axios.patch(`/admin/coupons/${id}/toggle`);
    return response.data;
  },
};
