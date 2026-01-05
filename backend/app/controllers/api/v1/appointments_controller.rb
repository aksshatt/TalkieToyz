module Api
  module V1
    class AppointmentsController < BaseController
      # POST /api/v1/appointments
      def create
        @appointment = Appointment.new(appointment_params)
        @appointment.user = current_user if defined?(current_user) && current_user

        if @appointment.save
          render_success(
            { id: @appointment.id },
            'Your appointment request has been submitted successfully. We will contact you soon!',
            status: :created
          )
        else
          render_error('Failed to submit appointment request', @appointment.errors.full_messages)
        end
      end

      private

      def appointment_params
        params.require(:appointment).permit(
          :name,
          :email,
          :phone,
          :message,
          :preferred_language
        )
      end
    end
  end
end
