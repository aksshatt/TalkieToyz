import axios from '../config/axios';
import type {
  ContactFormData,
  ContactSubmissionResponse,
  ContactSubmission,
  ContactStatistics
} from '../types/contact';

export const contactService = {
  // Submit contact form
  submitContact: async (data: ContactFormData): Promise<ContactSubmissionResponse> => {
    const response = await axios.post('/contact_submissions', {
      contact_submission: data
    });
    return response.data;
  },

  // Admin: Get all submissions
  getSubmissions: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<{ success: boolean; data: ContactSubmission[]; meta?: any }> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));

    const response = await axios.get(`/admin/contact_submissions?${queryParams.toString()}`);
    return response.data;
  },

  // Admin: Get single submission
  getSubmission: async (id: number): Promise<{ success: boolean; data: ContactSubmission }> => {
    const response = await axios.get(`/admin/contact_submissions/${id}`);
    return response.data;
  },

  // Admin: Update submission
  updateSubmission: async (
    id: number,
    data: Partial<ContactSubmission>
  ): Promise<{ success: boolean; data: ContactSubmission }> => {
    const response = await axios.patch(`/admin/contact_submissions/${id}`, {
      contact_submission: data
    });
    return response.data;
  },

  // Admin: Get statistics
  getStatistics: async (): Promise<{ success: boolean; data: ContactStatistics }> => {
    const response = await axios.get('/admin/contact_submissions/statistics');
    return response.data;
  },
};
