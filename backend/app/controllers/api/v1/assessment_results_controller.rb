module Api
  module V1
    class AssessmentResultsController < BaseController
      before_action :set_assessment_result, only: [:show, :download_pdf]

      # GET /api/v1/assessment_results/:id
      def show
        render_success(
          AssessmentResultSerializer.new(@assessment_result).as_json,
          'Assessment result retrieved successfully'
        )
      end

      # GET /api/v1/assessment_results/:id/download_pdf
      def download_pdf
        pdf = AssessmentResultPdfService.new(@assessment_result).generate

        send_data pdf.render,
                  filename: "assessment_result_#{@assessment_result.child_name}_#{Date.today}.pdf",
                  type: 'application/pdf',
                  disposition: 'attachment'
      end

      private

      def set_assessment_result
        @assessment_result = AssessmentResult.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Assessment result not found', nil, status: :not_found)
      end
    end
  end
end
