import axios from '../config/axios';

export interface ChildProfile {
  id: number;
  name: string;
  date_of_birth: string;
  age_months: number | null;
  age_display: string;
  speech_goals: string[];
  notes: string | null;
  avatar_color: string;
  created_at: string;
  milestone_achievements?: MilestoneAchievement[];
}

export interface MilestoneAchievement {
  id: number;
  achieved_at: string;
  certificate_shared: boolean;
  child_profile: { id: number; name: string } | null;
  milestone: {
    id: number;
    title: string;
    category: string;
    age_in_months: number;
    description: string;
  };
}

export const childProfilesService = {
  getProfiles: async () => {
    const response = await axios.get('/child_profiles');
    return response.data;
  },

  getProfile: async (id: number) => {
    const response = await axios.get(`/child_profiles/${id}`);
    return response.data;
  },

  createProfile: async (data: {
    name: string;
    date_of_birth: string;
    speech_goals?: string[];
    notes?: string;
    avatar_color?: string;
  }) => {
    const response = await axios.post('/child_profiles', { child_profile: data });
    return response.data;
  },

  updateProfile: async (id: number, data: Partial<{
    name: string;
    date_of_birth: string;
    speech_goals: string[];
    notes: string;
    avatar_color: string;
  }>) => {
    const response = await axios.patch(`/child_profiles/${id}`, { child_profile: data });
    return response.data;
  },

  deleteProfile: async (id: number) => {
    const response = await axios.delete(`/child_profiles/${id}`);
    return response.data;
  },

  getRecommendations: async (id: number) => {
    const response = await axios.get(`/child_profiles/${id}/recommendations`);
    return response.data;
  },
};
