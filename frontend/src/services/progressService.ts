import axios from '../config/axios';
import type {
  ProgressLogsResponse,
  ProgressLogResponse,
  ProgressSummaryResponse,
  ProgressLogFilters,
  ProgressLogFormData,
  MilestonesResponse,
  MilestoneResponse,
  MilestoneFilters,
} from '../types/progress';

export const progressService = {
  // Progress Logs
  getProgressLogs: async (filters: ProgressLogFilters = {}): Promise<ProgressLogsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`/progress_logs?${params.toString()}`);
    return response.data;
  },

  getProgressLog: async (id: number): Promise<ProgressLogResponse> => {
    const response = await axios.get(`/progress_logs/${id}`);
    return response.data;
  },

  createProgressLog: async (data: ProgressLogFormData): Promise<ProgressLogResponse> => {
    const response = await axios.post('/progress_logs', { progress_log: data });
    return response.data;
  },

  updateProgressLog: async (id: number, data: ProgressLogFormData): Promise<ProgressLogResponse> => {
    const response = await axios.patch(`/progress_logs/${id}`, { progress_log: data });
    return response.data;
  },

  deleteProgressLog: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/progress_logs/${id}`);
    return response.data;
  },

  getProgressSummary: async (childName: string): Promise<ProgressSummaryResponse> => {
    const response = await axios.get(`/progress_logs/summary?child_name=${encodeURIComponent(childName)}`);
    return response.data;
  },

  exportPDF: async (childName: string): Promise<Blob> => {
    const response = await axios.post(
      `/progress_logs/export_pdf`,
      { child_name: childName },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Milestones
  getMilestones: async (filters: MilestoneFilters = {}): Promise<MilestonesResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`/milestones?${params.toString()}`);
    return response.data;
  },

  getMilestone: async (id: number): Promise<MilestoneResponse> => {
    const response = await axios.get(`/milestones/${id}`);
    return response.data;
  },
};
