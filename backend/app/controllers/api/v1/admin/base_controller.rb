module Api
  module V1
    module Admin
      class BaseController < Api::V1::BaseController
        before_action :authorize_admin!

        private

        def authorize_admin!
          unless current_user&.admin?
            render_error(
              'Unauthorized access. Admin privileges required.',
              nil,
              status: :forbidden
            )
          end
        end

        # Helper method to log admin activity
        def log_activity(action, resource_type, resource_id = nil, details = {})
          AdminActivityLog.create(
            user: current_user,
            action: action,
            resource_type: resource_type,
            resource_id: resource_id,
            details: details,
            ip_address: request.remote_ip,
            user_agent: request.user_agent
          )
        rescue => e
          Rails.logger.error("Failed to log admin activity: #{e.message}")
        end
      end
    end
  end
end
