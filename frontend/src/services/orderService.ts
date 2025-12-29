import axiosInstance from '../config/axios';
import type {
  OrdersResponse,
  OrderResponse,
  CreateOrderData,
  RazorpayOrderResponse,
  VerifyPaymentData,
  ValidateCouponData,
  ValidateCouponResponse,
} from '../types/order';

const orderService = {
  /**
   * Get all orders for current user
   */
  getOrders: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<OrdersResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));

    const response = await axiosInstance.get(
      `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    return response.data;
  },

  /**
   * Get single order by ID
   */
  getOrder: async (orderId: number): Promise<OrderResponse> => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Create new order from cart
   */
  createOrder: async (data: CreateOrderData): Promise<OrderResponse> => {
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (
    orderId: number,
    reason?: string
  ): Promise<OrderResponse> => {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data;
  },

  /**
   * Create Razorpay order for payment
   */
  createRazorpayOrder: async (
    orderId: number
  ): Promise<RazorpayOrderResponse> => {
    const response = await axiosInstance.post(
      `/orders/${orderId}/create_razorpay_order`
    );
    return response.data;
  },

  /**
   * Verify Razorpay payment signature
   */
  verifyPayment: async (
    orderId: number,
    data: VerifyPaymentData
  ): Promise<OrderResponse> => {
    const response = await axiosInstance.post(
      `/orders/${orderId}/payment/verify`,
      data
    );
    return response.data;
  },

  /**
   * Retry payment for failed/awaiting payment orders
   */
  retryPayment: async (orderId: number): Promise<RazorpayOrderResponse> => {
    const response = await axiosInstance.post(
      `/orders/${orderId}/retry_payment`
    );
    return response.data;
  },

  /**
   * Validate coupon code
   */
  validateCoupon: async (
    data: ValidateCouponData
  ): Promise<ValidateCouponResponse> => {
    const response = await axiosInstance.post('/coupons/validate', data);
    return response.data;
  },
};

export default orderService;
