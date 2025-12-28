module Api
  module V1
    class AssessmentsController < BaseController
      before_action :authenticate_user!, only: [:submit]
      before_action :set_assessment, only: [:show, :submit]

      # GET /api/v1/assessments
      def index
        @assessments = Assessment.active

        # Apply filters
        @assessments = @assessments.by_age_range(params[:age]) if params[:age].present?

        # Apply search
        @assessments = @assessments.search(params[:q]) if params[:q].present?

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 20, 100].min

        @assessments = @assessments.page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @assessments,
            each_serializer: AssessmentSummarySerializer
          ).as_json,
          'Assessments retrieved successfully',
          meta: pagination_meta(@assessments)
        )
      end

      # GET /api/v1/assessments/:id
      def show
        render_success(
          AssessmentDetailSerializer.new(@assessment).as_json,
          'Assessment retrieved successfully'
        )
      end

      # POST /api/v1/assessments/:id/submit
      def submit
        @result = current_user.assessment_results.build(
          assessment: @assessment,
          child_name: params[:child_name],
          child_age_months: params[:child_age_months],
          answers: params[:answers] || {}
        )

        if @result.save
          render_success(
            AssessmentResultSerializer.new(@result).as_json,
            'Assessment submitted successfully',
            status: :created
          )
        else
          render_error('Failed to submit assessment', @result.errors.full_messages)
        end
      end

      private

      def set_assessment
        @assessment = Assessment.active.find_by!(slug: params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Assessment not found', nil, status: :not_found)
      end
    end
  end
end
