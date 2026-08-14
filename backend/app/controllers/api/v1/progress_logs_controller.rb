module Api
  module V1
    class ProgressLogsController < BaseController
      before_action :authenticate_user!
      before_action :set_log, only: [:show, :update, :destroy]

      # GET /api/v1/progress_logs
      def index
        logs = current_user.progress_logs.active.recent

        logs = logs.for_child(params[:child_name]) if params[:child_name].present?
        logs = logs.by_category(params[:category]) if params[:category].present?
        logs = logs.where(log_date: params[:from]..params[:to]) if params[:from].present? && params[:to].present?

        render_success(logs.as_json, 'Progress logs retrieved successfully')
      end

      # GET /api/v1/progress_logs/:id
      def show
        render_success(@log.as_json, 'Progress log retrieved successfully')
      end

      # POST /api/v1/progress_logs
      def create
        log = current_user.progress_logs.build(log_params)

        if log.save
          render_success(log.as_json, 'Progress log created successfully', status: :created)
        else
          render_error('Failed to create progress log', log.errors.full_messages, status: :unprocessable_entity)
        end
      end

      # PATCH /api/v1/progress_logs/:id
      def update
        if @log.update(log_params)
          render_success(@log.as_json, 'Progress log updated successfully')
        else
          render_error('Failed to update progress log', @log.errors.full_messages, status: :unprocessable_entity)
        end
      end

      # DELETE /api/v1/progress_logs/:id
      def destroy
        @log.soft_delete!
        render_success(nil, 'Progress log deleted successfully')
      end

      private

      def set_log
        @log = current_user.progress_logs.active.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Progress log not found', nil, status: :not_found)
      end

      def log_params
        params.permit(
          :child_name, :child_age_months, :log_date, :category,
          :notes, :milestone_id, :product_id,
          metrics: {}, achievements: []
        )
      end
    end
  end
end
