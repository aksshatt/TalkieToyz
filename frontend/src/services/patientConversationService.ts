import axiosInstance from '../config/axios';
import type { Conversation, Message } from './therapistService';

export interface PatientConversation {
  id: number;
  therapist: { id: number; name: string; avatar_url?: string };
  last_message?: { content: string; message_type: string; created_at: string };
  unread_by_patient: number;
  last_message_at?: string;
  created_at: string;
}

const patientConversationService = {
  getConversations: async (): Promise<{ success: boolean; data: PatientConversation[] }> => {
    const res = await axiosInstance.get('/patient/conversations');
    return res.data;
  },

  getConversation: async (id: number): Promise<{ success: boolean; data: { conversation: PatientConversation; messages: Message[] } }> => {
    const res = await axiosInstance.get(`/patient/conversations/${id}`);
    return res.data;
  },

  sendMessage: async (conversationId: number, content: string): Promise<{ success: boolean; data: Message }> => {
    const res = await axiosInstance.post(`/patient/conversations/${conversationId}/messages`, { content });
    return res.data;
  },

  markRead: async (conversationId: number): Promise<void> => {
    await axiosInstance.patch(`/patient/conversations/${conversationId}/read`);
  },
};

export default patientConversationService;
