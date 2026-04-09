import axios from '../config/axios';

export interface ProductQuestion {
  id: number;
  question: string;
  answer: string | null;
  answered: boolean;
  answered_at: string | null;
  created_at: string;
  user: { id: number; name: string };
  answered_by: { id: number; name: string; role: string } | null;
}

export const productQuestionsService = {
  getQuestions: async (productSlug: string, page = 1) => {
    const response = await axios.get(`/products/${productSlug}/questions`, { params: { page } });
    return response.data;
  },

  askQuestion: async (productSlug: string, question: string) => {
    const response = await axios.post(`/products/${productSlug}/questions`, { question });
    return response.data;
  },

  answerQuestion: async (productSlug: string, questionId: number, answer: string) => {
    const response = await axios.patch(`/products/${productSlug}/questions/${questionId}/answer`, { answer });
    return response.data;
  },
};
