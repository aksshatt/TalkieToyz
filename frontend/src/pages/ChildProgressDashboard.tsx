import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, Star, ShoppingCart, ChevronLeft, Trophy, Download, Share2, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { childProfilesService } from '../services/childProfilesService';
import { milestoneAchievementsService } from '../services/milestoneAchievementsService';
import axios from '../config/axios';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const MilestoneCard: React.FC<{
  milestone: any;
  isAchieved: boolean;
  achievement?: any;
  onMark: () => void;
  onUnmark: () => void;
  loading: boolean;
}> = ({ milestone, isAchieved, achievement, onMark, onUnmark, loading }) => {
  const [showCert, setShowCert] = useState(false);

  return (
    <div className={`rounded-xl border p-4 transition ${isAchieved ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAchieved ? 'bg-green-500' : 'bg-gray-200'}`}>
          {isAchieved ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-xs text-gray-400">{Math.floor(milestone.age_in_months / 12)}y</span>}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{milestone.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{milestone.category} · {milestone.age_in_months} months</p>
          {milestone.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{milestone.description}</p>}
          {isAchieved && achievement && (
            <p className="text-xs text-green-600 font-medium mt-1">
              Achieved {new Date(achievement.achieved_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {isAchieved ? (
            <>
              <button
                onClick={() => setShowCert(true)}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <Award className="w-3 h-3" /> Certificate
              </button>
              <button
                onClick={onUnmark}
                disabled={loading}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Unmark
              </button>
            </>
          ) : (
            <button
              onClick={onMark}
              disabled={loading}
              className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Mark done
            </button>
          )}
        </div>
      </div>

      {showCert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Achievement Unlocked!</h2>
            <p className="text-gray-500 mb-3 text-sm">This certifies that</p>
            <p className="text-2xl font-bold text-indigo-700 mb-3">{milestone.title}</p>
            <p className="text-sm text-gray-500 mb-6">has been achieved successfully.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: `Milestone: ${milestone.title}`, text: `We just achieved: ${milestone.title}! 🎉` });
                  }
                  setShowCert(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-indigo-200 text-indigo-600 py-2 rounded-xl text-sm hover:bg-indigo-50"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => setShowCert(false)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChildProgressDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const profileId = parseInt(id || '0', 10);

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['child_profile', profileId],
    queryFn: () => childProfilesService.getProfile(profileId),
    enabled: !!profileId,
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['milestone_achievements', profileId],
    queryFn: () => milestoneAchievementsService.getAchievements(profileId),
    enabled: !!profileId,
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ['child_recommendations', profileId],
    queryFn: () => childProfilesService.getRecommendations(profileId),
    enabled: !!profileId,
  });

  const { data: milestonesData } = useQuery({
    queryKey: ['all_milestones'],
    queryFn: async () => {
      const response = await axios.get('/milestones');
      return response.data;
    },
  });

  const markMutation = useMutation({
    mutationFn: (milestoneId: number) => milestoneAchievementsService.markAchieved(milestoneId, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestone_achievements'] });
    },
  });

  const unmarkMutation = useMutation({
    mutationFn: (achievementId: number) => milestoneAchievementsService.removeAchievement(achievementId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['milestone_achievements'] }),
  });

  const profile = profileData?.data;
  const achievements: any[] = achievementsData?.data || [];
  const recommendations: any[] = recommendationsData?.data || [];
  const milestones: any[] = milestonesData?.data || [];

  const achievedMilestoneIds = new Set(achievements.map((a: any) => a.milestone.id));
  const achievementByMilestone = Object.fromEntries(achievements.map((a: any) => [a.milestone.id, a]));

  // Filter milestones by child's age range
  const ageMonths = profile?.age_months || 0;
  const relevantMilestones = milestones
    .filter(m => m.age_in_months <= ageMonths + 12)
    .sort((a, b) => a.age_in_months - b.age_in_months);

  const progressPercent = relevantMilestones.length > 0
    ? Math.round((achievements.filter(a => relevantMilestones.find(m => m.id === a.milestone.id)).length / relevantMilestones.length) * 100)
    : 0;

  if (profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Child profile not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO url={`/children/${id}`} />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link to="/children" className="p-2 rounded-xl hover:bg-gray-200 transition">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: profile.avatar_color }}
            >
              {profile.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profile.name}'s Progress</h1>
              <p className="text-sm text-gray-500">{profile.age_display}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-900">Milestone Progress</h2>
                <p className="text-sm text-gray-500">{achievements.length} of {relevantMilestones.length} milestones achieved</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-indigo-600">{progressPercent}%</span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {profile.speech_goals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.speech_goals.map((g: string) => (
                  <span key={g} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">{g}</span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Milestones */}
            <div className="lg:col-span-2">
              <h2 className="font-bold text-gray-900 mb-4">Milestones for {profile.name}</h2>
              {relevantMilestones.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No milestones available for this age range.</p>
              ) : (
                <div className="space-y-3">
                  {relevantMilestones.map(milestone => (
                    <MilestoneCard
                      key={milestone.id}
                      milestone={milestone}
                      isAchieved={achievedMilestoneIds.has(milestone.id)}
                      achievement={achievementByMilestone[milestone.id]}
                      onMark={() => markMutation.mutate(milestone.id)}
                      onUnmark={() => {
                        const achievement = achievementByMilestone[milestone.id];
                        if (achievement) unmarkMutation.mutate(achievement.id);
                      }}
                      loading={markMutation.isPending || unmarkMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="font-bold text-gray-900 mb-4">Recommended for {profile.name}</h2>
              {recommendations.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No recommendations yet.</p>
              ) : (
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((product: any) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-3 flex gap-3 hover:shadow-sm transition">
                      {product.image_urls?.[0] ? (
                        <img src={product.image_urls[0].url} alt={product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-indigo-200" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${product.slug}`} className="text-xs font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2">
                          {product.name}
                        </Link>
                        <p className="text-indigo-600 font-bold text-sm mt-1">₹{product.price}</p>
                        <button
                          onClick={() => dispatch(addToCart({ product_id: product.id, quantity: 1 }))}
                          className="mt-1 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          <ShoppingCart className="w-3 h-3" /> Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChildProgressDashboard;
