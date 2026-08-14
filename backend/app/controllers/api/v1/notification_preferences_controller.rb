module Api
  module V1
    class NotificationPreferencesController < BaseController
      before_action :authenticate_user!

      # GET /api/v1/notification_preferences
      def show
        render_success(current_user.notification_preferences, 'Notification preferences retrieved')
      end

      # PATCH /api/v1/notification_preferences
      def update
        allowed = %w[order_updates whatsapp email sms promotions loyalty_points]
        prefs = params.permit(*allowed).to_h.select { |k, _| allowed.include?(k) }

        if prefs.empty?
          return render_error('No valid preferences provided', nil, status: :bad_request)
        end

        current_user.update_notification_preferences(prefs)
        render_success(current_user.notification_preferences, 'Notification preferences updated')
      rescue => e
        render_error('Failed to update preferences', [e.message], status: :unprocessable_entity)
      end
    end
  end
end
