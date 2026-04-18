import axiosInstance from '../config/axios';

// ── Types ──────────────────────────────────────────────────────────────────

export interface PatientSummary {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  assigned_at: string;
  notes?: string;
  unread_messages: number;
  last_message_at?: string;
  conversation_id?: number;
}

export interface PatientDetail extends PatientSummary {
  bio?: string;
  created_at: string;
  assessment_results: AssessmentResultSummary[];
}

export interface AssessmentResultSummary {
  id: number;
  assessment_title: string;
  assessment_slug: string;
  child_name: string;
  percentage_score: number;
  total_score: number;
  completed_at: string;
  recommendations?: any;
}

export interface Conversation {
  id: number;
  patient: { id: number; name: string; avatar_url?: string };
  last_message?: { content: string; message_type: string; created_at: string };
  unread_by_therapist: number;
  last_message_at?: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  message_type: 'text' | 'product' | 'assessment';
  content?: string;
  metadata?: {
    product_id?: number;
    product_slug?: string;
    product_name?: string;
    image_url?: string;
    assessment_id?: number;
    assessment_slug?: string;
    assessment_title?: string;
  };
  read_at?: string;
  created_at: string;
}

export interface MessageTemplate {
  id: number;
  title: string;
  content: string;
  category?: string;
  shared: boolean;
  created_by_id: number;
  created_at: string;
}

// ── Patients ───────────────────────────────────────────────────────────────

const therapistService = {
  getPatients: async (): Promise<{ success: boolean; data: PatientSummary[] }> => {
    const res = await axiosInstance.get('/therapist/patients');
    return res.data;
  },

  getPatient: async (id: number): Promise<{ success: boolean; data: PatientDetail }> => {
    const res = await axiosInstance.get(`/therapist/patients/${id}`);
    return res.data;
  },

  // ── Conversations ────────────────────────────────────────────────────────

  getConversations: async (): Promise<{ success: boolean; data: Conversation[] }> => {
    const res = await axiosInstance.get('/therapist/conversations');
    return res.data;
  },

  getOrCreateConversation: async (patient_id: number): Promise<{ success: boolean; data: Conversation }> => {
    const res = await axiosInstance.post('/therapist/conversations', { patient_id });
    return res.data;
  },

  getConversation: async (id: number): Promise<{ success: boolean; data: { conversation: Conversation; messages: Message[] } }> => {
    const res = await axiosInstance.get(`/therapist/conversations/${id}`);
    return res.data;
  },

  // ── Messages ─────────────────────────────────────────────────────────────

  sendMessage: async (
    conversationId: number,
    payload: { message_type: string; content?: string; metadata?: object }
  ): Promise<{ success: boolean; data: Message }> => {
    const res = await axiosInstance.post(`/therapist/conversations/${conversationId}/messages`, payload);
    return res.data;
  },

  markRead: async (conversationId: number): Promise<void> => {
    await axiosInstance.patch(`/therapist/conversations/${conversationId}/messages/read`);
  },

  // ── Templates ────────────────────────────────────────────────────────────

  getTemplates: async (category?: string): Promise<{ success: boolean; data: MessageTemplate[]; categories: string[] }> => {
    const res = await axiosInstance.get('/therapist/message_templates', { params: { category } });
    return res.data;
  },

  createTemplate: async (data: Partial<MessageTemplate>): Promise<{ success: boolean; data: MessageTemplate }> => {
    const res = await axiosInstance.post('/therapist/message_templates', data);
    return res.data;
  },

  updateTemplate: async (id: number, data: Partial<MessageTemplate>): Promise<{ success: boolean; data: MessageTemplate }> => {
    const res = await axiosInstance.patch(`/therapist/message_templates/${id}`, data);
    return res.data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/therapist/message_templates/${id}`);
  },
};

export default therapistService;
