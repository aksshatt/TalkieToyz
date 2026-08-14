module Api
  module V1
    module Therapist
      class CredentialsController < BaseController
        before_action :authenticate_user!
        before_action :require_therapist

        # GET /api/v1/therapist/credentials
        def show
          render_success(credentials_json, 'Credentials retrieved successfully')
        end

        # PATCH /api/v1/therapist/credentials
        def update
          if current_user.update(credential_params)
            render_success(credentials_json, 'Credentials updated successfully')
          else
            render_error('Failed to update credentials', current_user.errors.full_messages, status: :unprocessable_entity)
          end
        end

        private

        def require_therapist
          unless current_user.therapist? || current_user.admin?
            render_error('Therapist access required', nil, status: :forbidden)
          end
        end

        def credentials_json
          {
            certifications: current_user.certifications,
            experience_years: current_user.experience_years,
            specializations: current_user.specializations,
            languages_spoken: current_user.languages_spoken,
            bio: current_user.bio
          }
        end

        def credential_params
          params.permit(
            :experience_years, :bio,
            certifications: [:name, :issuer, :year],
            specializations: [],
            languages_spoken: []
          )
        end
      end
    end
  end
end
