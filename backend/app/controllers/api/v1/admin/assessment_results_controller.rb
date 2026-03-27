module Api
  module V1
    module Admin
      class AssessmentResultsController < BaseController
        before_action :authenticate_admin!
        before_action :set_result, only: [:show]

        # GET /api/v1/admin/assessment_results
        def index
          @results = AssessmentResult.includes(:assessment, :user)

          @results = @results.where(assessment_id: params[:assessment_id]) if params[:assessment_id].present?
          @results = @results.where(mother_tongue: params[:mother_tongue]) if params[:mother_tongue].present?

          if params[:score_level].present?
            @results = case params[:score_level]
                       when 'excellent'  then @results.joins(:assessment) # filtered below
                       when 'good'       then @results
                       when 'progress'   then @results
                       when 'needs_support' then @results
                       else @results
                       end
          end

          if params[:q].present?
            q = "%#{params[:q].downcase}%"
            @results = @results.where('LOWER(child_name) LIKE ?', q)
          end

          @results = @results.order(completed_at: :desc)

          page     = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min
          @results = @results.page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @results,
              each_serializer: AssessmentResultSerializer
            ).as_json,
            'Assessment results retrieved successfully',
            meta: pagination_meta(@results)
          )
        end

        # GET /api/v1/admin/assessment_results/:id
        def show
          render_success(
            AssessmentResultSerializer.new(@result).as_json,
            'Assessment result retrieved successfully'
          )
        end

        # GET /api/v1/admin/assessment_results/statistics
        def statistics
          total   = AssessmentResult.count
          by_assessment = AssessmentResult.joins(:assessment)
                                          .group('assessments.title')
                                          .count
          avg_score = AssessmentResult.average(:total_score).to_f.round(2)
          total_pdf_downloads = AssessmentResult.sum(:pdf_download_count)
          by_mother_tongue = AssessmentResult.where.not(mother_tongue: nil)
                                             .group(:mother_tongue)
                                             .count

          render_success({
            total: total,
            by_assessment: by_assessment,
            average_score: avg_score,
            total_pdf_downloads: total_pdf_downloads,
            by_mother_tongue: by_mother_tongue
          }, 'Statistics retrieved successfully')
        end

        private

        def set_result
          @result = AssessmentResult.includes(:assessment, :user).find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Assessment result not found', nil, status: :not_found)
        end

        def authenticate_admin!
          render_error('Unauthorized', nil, status: :forbidden) unless current_user&.admin?
        end
      end
    end
  end
end
