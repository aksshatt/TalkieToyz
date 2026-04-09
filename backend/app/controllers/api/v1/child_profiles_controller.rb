module Api
  module V1
    class ChildProfilesController < BaseController
      before_action :authenticate_user!
      before_action :set_profile, only: [:show, :update, :destroy, :recommendations]

      # GET /api/v1/child_profiles
      def index
        @profiles = current_user.child_profiles.order(created_at: :desc)
        render_success(@profiles.map { |p| serialize_profile(p) }, 'Child profiles retrieved')
      end

      # GET /api/v1/child_profiles/:id
      def show
        render_success(serialize_profile(@profile, detailed: true), 'Child profile retrieved')
      end

      # POST /api/v1/child_profiles
      def create
        @profile = current_user.child_profiles.build(profile_params)

        if @profile.save
          render_success(serialize_profile(@profile), 'Child profile created', status: :created)
        else
          render_error('Failed to create profile', @profile.errors.full_messages)
        end
      end

      # PATCH /api/v1/child_profiles/:id
      def update
        if @profile.update(profile_params)
          render_success(serialize_profile(@profile), 'Child profile updated')
        else
          render_error('Failed to update profile', @profile.errors.full_messages)
        end
      end

      # DELETE /api/v1/child_profiles/:id
      def destroy
        @profile.destroy
        render_success(nil, 'Child profile deleted')
      end

      # GET /api/v1/child_profiles/:id/recommendations
      def recommendations
        age_months = @profile.age_in_months || 24
        speech_goals = @profile.speech_goals || []

        products = Product.active.includes(:category, :speech_goals, images_attachments: :blob)

        if speech_goals.any?
          matching_goals = SpeechGoal.where(name: speech_goals).pluck(:id)
          products = products.by_speech_goals(matching_goals) if matching_goals.any?
        end

        # Filter by age range - convert months to years for min/max_age columns
        age_years = age_months / 12
        products = products.where('min_age <= ? AND max_age >= ?', age_years, age_years)
                           .limit(8)
                           .order(view_count: :desc)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            products, each_serializer: ProductSummarySerializer
          ).as_json,
          'Recommendations retrieved'
        )
      end

      private

      def set_profile
        @profile = current_user.child_profiles.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Child profile not found', nil, status: :not_found)
      end

      def profile_params
        params.require(:child_profile).permit(:name, :date_of_birth, :notes, :avatar_color, speech_goals: [])
      end

      def serialize_profile(profile, detailed: false)
        data = {
          id: profile.id,
          name: profile.name,
          date_of_birth: profile.date_of_birth,
          age_months: profile.age_in_months,
          age_display: profile.age_display,
          speech_goals: profile.speech_goals,
          notes: profile.notes,
          avatar_color: profile.avatar_color,
          created_at: profile.created_at
        }

        if detailed
          achievements = profile.milestone_achievements.includes(:milestone).order(achieved_at: :desc)
          data[:milestone_achievements] = achievements.map do |a|
            {
              id: a.id,
              achieved_at: a.achieved_at,
              certificate_shared: a.certificate_shared,
              milestone: {
                id: a.milestone.id,
                title: a.milestone.title,
                category: a.milestone.category,
                age_in_months: a.milestone.age_in_months
              }
            }
          end
        end

        data
      end
    end
  end
end
