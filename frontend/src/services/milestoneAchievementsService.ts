import axios from '../config/axios';

export const milestoneAchievementsService = {
  getAchievements: async (childProfileId?: number) => {
    const response = await axios.get('/milestone_achievements', {
      params: childProfileId ? { child_profile_id: childProfileId } : {}
    });
    return response.data;
  },

  markAchieved: async (milestoneId: number, childProfileId?: number) => {
    const response = await axios.post('/milestone_achievements', {
      milestone_id: milestoneId,
      child_profile_id: childProfileId
    });
    return response.data;
  },

  removeAchievement: async (achievementId: number) => {
    const response = await axios.delete(`/milestone_achievements/${achievementId}`);
    return response.data;
  },
};
