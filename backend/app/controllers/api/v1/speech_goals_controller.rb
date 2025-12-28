module Api
  module V1
    class SpeechGoalsController < BaseController
      # GET /api/v1/speech_goals
      def index
        @speech_goals = SpeechGoal.active

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @speech_goals,
            each_serializer: SpeechGoalSerializer
          ).as_json,
          'Speech goals retrieved successfully'
        )
      end

      # GET /api/v1/speech_goals/:id
      def show
        @speech_goal = SpeechGoal.active.find_by!(slug: params[:id])

        # Get products with this speech goal
        page = params[:page] || 1
        per_page = params[:per_page] || 20

        @products = @speech_goal.products.active
                                 .includes(:category)
                                 .page(page)
                                 .per(per_page)

        render_success(
          {
            speech_goal: SpeechGoalSerializer.new(@speech_goal).as_json,
            products: ActiveModelSerializers::SerializableResource.new(
              @products,
              each_serializer: ProductSummarySerializer
            ).as_json
          },
          'Speech goal retrieved successfully',
          meta: pagination_meta(@products)
        )
      rescue ActiveRecord::RecordNotFound
        render_error('Speech goal not found', nil, status: :not_found)
      end
    end
  end
end
