module Api
  module V1
    class ContactSubmissionsController < BaseController
      # POST /api/v1/contact_submissions
      def create
        @submission = ContactSubmission.new(contact_submission_params)
        @submission.user = current_user if defined?(current_user) && current_user

        if @submission.save
          render_success(
            { id: @submission.id },
            'Your message has been sent successfully. We will get back to you soon!',
            status: :created
          )
        else
          render_error('Failed to send message', @submission.errors.full_messages)
        end
      end

      private

      def contact_submission_params
        params.require(:contact_submission).permit(
          :name,
          :email,
          :phone,
          :subject,
          :message
        )
      end
    end
  end
end
