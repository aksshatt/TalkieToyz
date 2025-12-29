import axiosInstance from '../config/axios';
import type {
  ShippingRateRequest,
  ShippingRateResponse,
} from '../types/shipment';

const shippingService = {
  /**
   * Calculate shipping rates for given destination
   */
  calculateRates: async (data: ShippingRateRequest): Promise<ShippingRateResponse> => {
    const response = await axiosInstance.post('/shipping_rates', data);
    return response.data.data;
  },
};

export default shippingService;
