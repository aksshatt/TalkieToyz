import axiosInstance from '../config/axios';

export interface TherapistApproval {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Assignment {
  id: number;
  therapist_id: number;
  patient_id: number;
  therapist_name: string;
  therapist_email: string;
  patient_name: string;
  patient_email: string;
  assigned_by: string;
  notes?: string;
  active: boolean;
  created_at: string;
}

export interface AdminConversation {
  id: number;
  therapist_id: number;
  patient_id: number;
  therapist_name: string;
  patient_name: string;
  message_count: number;
  last_message?: { content: string; message_type: string; created_at: string; sender: string };
  last_message_at?: string;
  unread_by_therapist: number;
  unread_by_patient: number;
  created_at: string;
}

export interface AdminMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message_type: string;
  content?: string;
  metadata?: Record<string, any>;
  read_at?: string;
  created_at: string;
}

const adminTherapistService = {
  // Approvals
  getApprovals: async (): Promise<{ success: boolean; data: TherapistApproval[] }> => {
    const res = await axiosInstance.get('/admin/therapist_approvals');
    return res.data;
  },

  approveTherapist: async (id: number): Promise<{ success: boolean; message: string; data: TherapistApproval }> => {
    const res = await axiosInstance.post(`/admin/therapist_approvals/${id}/approve`);
    return res.data;
  },

  rejectTherapist: async (id: number, reason?: string): Promise<{ success: boolean; message: string }> => {
    const res = await axiosInstance.post(`/admin/therapist_approvals/${id}/reject`, { reason });
    return res.data;
  },

  // Assignments
  getAssignments: async (filters?: { therapist_id?: number; patient_id?: number }): Promise<{ success: boolean; data: Assignment[] }> => {
    const res = await axiosInstance.get('/admin/therapist_assignments', { params: filters });
    return res.data;
  },

  getTherapists: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await axiosInstance.get('/admin/therapist_assignments/therapists');
    return res.data;
  },

  getPatients: async (): Promise<{ success: boolean; data: any[] }> => {
    const res = await axiosInstance.get('/admin/therapist_assignments/patients');
    return res.data;
  },

  assignPatient: async (therapistId: number, patientId: number, notes?: string): Promise<{ success: boolean; data: Assignment }> => {
    const res = await axiosInstance.post('/admin/therapist_assignments', { therapist_id: therapistId, patient_id: patientId, notes });
    return res.data;
  },

  unassignPatient: async (id: number): Promise<{ success: boolean; message: string }> => {
    const res = await axiosInstance.delete(`/admin/therapist_assignments/${id}`);
    return res.data;
  },

  // Conversation monitoring
  getConversations: async (filters?: { therapist_id?: number; patient_id?: number }): Promise<{ success: boolean; data: AdminConversation[] }> => {
    const res = await axiosInstance.get('/admin/conversations', { params: filters });
    return res.data;
  },

  getConversationMessages: async (id: number): Promise<{ success: boolean; data: { conversation: AdminConversation; messages: AdminMessage[] } }> => {
    const res = await axiosInstance.get(`/admin/conversations/${id}`);
    return res.data;
  },
};

export default adminTherapistService;
