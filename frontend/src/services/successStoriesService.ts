import axios from '../config/axios';

export interface SuccessStory {
  id: number;
  child_name: string;
  age_months: number | null;
  speech_goal: string | null;
  before_text: string;
  after_text: string;
  featured: boolean;
  created_at: string;
  user: { id: number; name: string };
  product: { id: number; name: string; slug: string } | null;
}

export const successStoriesService = {
  getStories: async (params?: { product_id?: number; featured?: boolean; page?: number }) => {
    const response = await axios.get('/success_stories', { params });
    return response.data;
  },

  submitStory: async (data: {
    child_name: string;
    age_months?: number;
    speech_goal?: string;
    before_text: string;
    after_text: string;
    product_id?: number;
  }) => {
    const response = await axios.post('/success_stories', { success_story: data });
    return response.data;
  },
};
