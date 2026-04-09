import axios from '../config/axios';

export interface LoyaltyTransaction {
  id: number;
  points: number;
  source: string;
  description: string;
  created_at: string;
}

export const loyaltyService = {
  getPoints: async (page = 1) => {
    const response = await axios.get('/loyalty_points', { params: { page } });
    return response.data;
  },

  redeemPoints: async (points: number) => {
    const response = await axios.post('/loyalty_points/redeem', { points });
    return response.data;
  },
};
