module Api
  module V1
    module Admin
      class ActivityLogsController < BaseController
        # GET /api/v1/admin/activity_logs
        def index
          @logs = AdminActivityLog.includes(:user).order(created_at: :desc)

          @logs = @logs.where(action: params[:action_filter]) if params[:action_filter].present?
          if params[:q].present?
            @logs = @logs.where('resource_type ILIKE ?', "%#{params[:q]}%")
          end

          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 25, 100].min
          @logs = @logs.page(page).per(per_page)

          render_success(
            @logs.map { |log|
              {
                id: log.id,
                action: log.action,
                resource_type: log.resource_type,
                resource_id: log.resource_id,
                details: log.details,
                user_id: log.user_id,
                user_name: log.user&.name,
                created_at: log.created_at.iso8601
              }
            },
            'Activity logs retrieved successfully',
            meta: pagination_meta(@logs)
          )
        end
      end
    end
  end
end
