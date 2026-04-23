export interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  preferred_language: string;
  service_id?: number;
  preferred_date?: string | null;
  child_name?: string;
  child_age?: string;
}

export interface Appointment extends AppointmentFormData {
  id: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  user_id?: number;
  user_name?: string;
  service_name?: string | null;
  service_price?: number | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: { id: number };
}
