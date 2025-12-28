export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  id: number;
  status: 'pending' | 'in_progress' | 'resolved' | 'spam';
  admin_notes?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data: { id: number };
}

export interface ContactStatistics {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  spam: number;
  today: number;
  this_week: number;
  this_month: number;
}
