import axios from '../config/axios';

export interface QuizQuestion {
  id: number;
  question: string;
  options: Array<{ value: string; label: string }>;
}

export const quizService = {
  getQuestions: async (): Promise<{ success: boolean; data: QuizQuestion[] }> => {
    const response = await axios.get('/goal_quiz/questions');
    return response.data;
  },

  getRecommendations: async (answers: {
    goal: string;
    age_range: string;
    activity_type: string;
  }) => {
    const response = await axios.post('/goal_quiz/recommend', answers);
    return response.data;
  },
};
