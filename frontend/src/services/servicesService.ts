import axios from '../config/axios';

export interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
  icon?: string;
  display_order: number;
  active?: boolean;
}

export const servicesService = {
  list: async (): Promise<ServiceItem[]> => {
    const res = await axios.get('/services');
    return res.data.data;
  },
  get: async (slug: string): Promise<ServiceItem> => {
    const res = await axios.get(`/services/${slug}`);
    return res.data.data;
  },
};

export const adminServicesService = {
  list: async (): Promise<ServiceItem[]> => {
    const res = await axios.get('/admin/services');
    return res.data.data;
  },
  get: async (id: number): Promise<ServiceItem> => {
    const res = await axios.get(`/admin/services/${id}`);
    return res.data.data;
  },
  create: async (service: Partial<ServiceItem>): Promise<ServiceItem> => {
    const res = await axios.post('/admin/services', { service });
    return res.data.data;
  },
  update: async (id: number, service: Partial<ServiceItem>): Promise<ServiceItem> => {
    const res = await axios.patch(`/admin/services/${id}`, { service });
    return res.data.data;
  },
  destroy: async (id: number): Promise<void> => {
    await axios.delete(`/admin/services/${id}`);
  },
};
