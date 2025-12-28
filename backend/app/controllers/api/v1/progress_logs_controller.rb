module Api
  module V1
    class ProgressLogsController < BaseController
      before_action :authenticate_user!
      before_action :set_progress_log, only: [:show, :update, :destroy]

      # GET /api/v1/progress_logs
      def index
        @logs = current_user.progress_logs.active

        # Apply filters
        @logs = @logs.by_child(params[:child_name]) if params[:child_name].present?
        @logs = @logs.by_category(params[:category]) if params[:category].present?

        if params[:start_date].present? && params[:end_date].present?
          @logs = @logs.by_date_range(params[:start_date], params[:end_date])
        end

        # Apply search
        @logs = @logs.search(params[:q]) if params[:q].present?

        # Sorting
        @logs = @logs.recent

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 20, 100].min

        @logs = @logs.includes(:milestone, :product).page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @logs,
            each_serializer: ProgressLogSerializer
          ).as_json,
          'Progress logs retrieved successfully',
          meta: pagination_meta(@logs)
        )
      end

      # GET /api/v1/progress_logs/:id
      def show
        render_success(
          ProgressLogSerializer.new(@log).as_json,
          'Progress log retrieved successfully'
        )
      end

      # GET /api/v1/progress_logs/summary
      def summary
        child_name = params[:child_name]

        unless child_name.present?
          return render_error('Child name is required', nil, status: :unprocessable_entity)
        end

        @logs = current_user.progress_logs.active.by_child(child_name)

        # Calculate summary statistics
        summary_data = {
          total_logs: @logs.count,
          categories: {},
          recent_achievements: [],
          progress_timeline: []
        }

        # Category breakdown
        ProgressLog.categories.keys.each do |category|
          category_logs = @logs.by_category(category)
          summary_data[:categories][category] = {
            count: category_logs.count,
            latest_log: category_logs.recent.first&.log_date
          }
        end

        # Recent achievements
        summary_data[:recent_achievements] = @logs.recent.limit(10).map do |log|
          {
            date: log.log_date,
            category: log.category,
            achievements: log.achievements,
            notes: log.notes&.truncate(100)
          }
        end

        # Progress timeline (last 6 months)
        6.downto(0) do |months_ago|
          date = months_ago.months.ago
          month_logs = @logs.where(
            log_date: date.beginning_of_month..date.end_of_month
          )

          summary_data[:progress_timeline] << {
            month: date.strftime('%B %Y'),
            log_count: month_logs.count,
            categories: month_logs.group(:category).count
          }
        end

        render_success(summary_data, 'Progress summary retrieved successfully')
      end

      # POST /api/v1/progress_logs
      def create
        @log = current_user.progress_logs.build(progress_log_params)

        if @log.save
          render_success(
            ProgressLogSerializer.new(@log).as_json,
            'Progress log created successfully',
            status: :created
          )
        else
          render_error('Failed to create progress log', @log.errors.full_messages)
        end
      end

      # PATCH /api/v1/progress_logs/:id
      def update
        if @log.update(progress_log_params)
          render_success(
            ProgressLogSerializer.new(@log).as_json,
            'Progress log updated successfully'
          )
        else
          render_error('Failed to update progress log', @log.errors.full_messages)
        end
      end

      # DELETE /api/v1/progress_logs/:id
      def destroy
        if @log.soft_delete
          render_success(nil, 'Progress log deleted successfully')
        else
          render_error('Failed to delete progress log', @log.errors.full_messages)
        end
      end

      # POST /api/v1/progress_logs/export_pdf
      def export_pdf
        child_name = params[:child_name]

        unless child_name.present?
          return render_error('Child name is required', nil, status: :unprocessable_entity)
        end

        @logs = current_user.progress_logs.active.by_child(child_name).recent

        if @logs.empty?
          return render_error('No progress logs found for this child', nil, status: :not_found)
        end

        pdf_service = ProgressReportPdf.new(current_user, @logs, child_name)
        pdf_content = pdf_service.generate

        send_data pdf_content,
                  filename: "progress_report_#{child_name.parameterize}_#{Date.current}.pdf",
                  type: 'application/pdf',
                  disposition: 'attachment'
      rescue StandardError => e
        render_error('Failed to generate PDF', [e.message], status: :internal_server_error)
      end

      private

      def set_progress_log
        @log = current_user.progress_logs.active.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Progress log not found', nil, status: :not_found)
      end

      def progress_log_params
        params.require(:progress_log).permit(
          :child_name,
          :child_age_months,
          :log_date,
          :category,
          :notes,
          :milestone_id,
          :product_id,
          metrics: {},
          achievements: []
        )
      end
    end
  end
end
