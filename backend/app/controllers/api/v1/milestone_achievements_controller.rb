module Api
  module V1
    class MilestoneAchievementsController < BaseController
      before_action :authenticate_user!

      # GET /api/v1/milestone_achievements
      def index
        @achievements = current_user.milestone_achievements
                                    .includes(:milestone, :child_profile)
                                    .order(achieved_at: :desc)

        @achievements = @achievements.where(child_profile_id: params[:child_profile_id]) if params[:child_profile_id].present?

        render_success(@achievements.map { |a| serialize_achievement(a) }, 'Achievements retrieved')
      end

      # POST /api/v1/milestone_achievements
      def create
        milestone = Milestone.find(params[:milestone_id])
        child_profile = params[:child_profile_id].present? ? current_user.child_profiles.find(params[:child_profile_id]) : nil

        @achievement = current_user.milestone_achievements.build(
          milestone: milestone,
          child_profile: child_profile,
          achieved_at: Time.current
        )

        if @achievement.save
          render_success(serialize_achievement(@achievement), 'Milestone marked as achieved!', status: :created)
        else
          render_error('Failed to mark milestone', @achievement.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotFound => e
        render_error('Not found', [e.message], status: :not_found)
      end

      # DELETE /api/v1/milestone_achievements/:id
      def destroy
        @achievement = current_user.milestone_achievements.find(params[:id])
        @achievement.destroy
        render_success(nil, 'Achievement removed')
      rescue ActiveRecord::RecordNotFound
        render_error('Achievement not found', nil, status: :not_found)
      end

      private

      def serialize_achievement(a)
        {
          id: a.id,
          achieved_at: a.achieved_at,
          certificate_shared: a.certificate_shared,
          child_profile: a.child_profile ? { id: a.child_profile.id, name: a.child_profile.name } : nil,
          milestone: {
            id: a.milestone.id,
            title: a.milestone.title,
            category: a.milestone.category,
            age_in_months: a.milestone.age_in_months,
            description: a.milestone.description
          }
        }
      end
    end
  end
end
