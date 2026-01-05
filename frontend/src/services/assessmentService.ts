import axios from '../config/axios';
import type {
  AssessmentsResponse,
  AssessmentResponse,
  AssessmentResultResponse,
  AssessmentFilters,
  AssessmentSubmission,
} from '../types/assessment';

export const assessmentService = {
  // Get all assessments with filters
  getAssessments: async (filters: AssessmentFilters = {}): Promise<AssessmentsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`/assessments?${params.toString()}`);
    return response.data;
  },

  // Get single assessment by slug
  getAssessment: async (slug: string): Promise<AssessmentResponse> => {
    const response = await axios.get(`/assessments/${slug}`);
    return response.data;
  },

  // Submit assessment
  submitAssessment: async (
    slug: string,
    submission: AssessmentSubmission
  ): Promise<AssessmentResultResponse> => {
    const response = await axios.post(`/assessments/${slug}/submit`, submission);
    return response.data;
  },

  // Get assessment result by ID
  getAssessmentResult: async (id: string): Promise<AssessmentResultResponse> => {
    const response = await axios.get(`/assessment_results/${id}`);
    return response.data;
  },
};
