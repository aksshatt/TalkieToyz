import axios from '../config/axios';
import type {
  AppointmentFormData,
  AppointmentResponse,
  Appointment
} from '../types/appointment';

export const appointmentService = {
  // Submit appointment request (public)
  createAppointment: async (data: AppointmentFormData): Promise<AppointmentResponse> => {
    const response = await axios.post('/appointments', {
      appointment: data
    });
    return response.data;
  },

  // Admin: Get all appointments
  getAppointments: async (params?: {
    status?: string;
    language?: string;
    page?: number;
    per_page?: number;
  }): Promise<{ success: boolean; data: Appointment[]; meta?: any }> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.language) queryParams.append('language', params.language);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));

    const response = await axios.get(`/admin/appointments?${queryParams.toString()}`);
    return response.data;
  },

  // Admin: Get single appointment
  getAppointment: async (id: number): Promise<{ success: boolean; data: Appointment }> => {
    const response = await axios.get(`/admin/appointments/${id}`);
    return response.data;
  },

  // Admin: Update appointment
  updateAppointment: async (
    id: number,
    data: Partial<Appointment>
  ): Promise<{ success: boolean; data: Appointment }> => {
    const response = await axios.patch(`/admin/appointments/${id}`, {
      appointment: data
    });
    return response.data;
  },
};
