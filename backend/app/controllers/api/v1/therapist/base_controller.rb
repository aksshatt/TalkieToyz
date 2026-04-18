module Api
  module V1
    module Therapist
      class BaseController < Api::V1::BaseController
        before_action :authenticate_user!
        before_action :authorize_therapist!

        private

        def authorize_therapist!
          unless current_user&.therapist? || current_user&.admin?
            return render json: { success: false, message: 'Therapist access required.' }, status: :forbidden
          end

          if current_user.therapist? && !current_user.approval_approved?
            render json: {
              success: false,
              message: 'Your account is pending admin approval.',
              approval_status: current_user.approval_status
            }, status: :forbidden
          end
        end
      end
    end
  end
end
