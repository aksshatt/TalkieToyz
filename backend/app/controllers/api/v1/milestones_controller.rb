module Api
  module V1
    class MilestonesController < BaseController
      before_action :set_milestone, only: [:show]

      # GET /api/v1/milestones
      def index
        @milestones = Milestone.active

        # Apply filters
        @milestones = @milestones.by_category(params[:category]) if params[:category].present?

        if params[:age].present?
          @milestones = @milestones.by_age(params[:age])
        elsif params[:min_age].present? && params[:max_age].present?
          @milestones = @milestones.by_age_range(params[:min_age], params[:max_age])
        end

        # Apply search
        @milestones = @milestones.search(params[:q]) if params[:q].present?

        # Sorting
        @milestones = @milestones.ordered

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 20, 100].min

        @milestones = @milestones.page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @milestones,
            each_serializer: MilestoneSerializer
          ).as_json,
          'Milestones retrieved successfully',
          meta: pagination_meta(@milestones)
        )
      end

      # GET /api/v1/milestones/:id
      def show
        render_success(
          MilestoneSerializer.new(@milestone).as_json,
          'Milestone retrieved successfully'
        )
      end

      private

      def set_milestone
        @milestone = Milestone.active.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Milestone not found', nil, status: :not_found)
      end
    end
  end
end
