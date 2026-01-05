module Api
  module V1
    module Admin
      class AppointmentsController < BaseController
        before_action :set_appointment, only: [:show, :update]

        # GET /api/v1/admin/appointments
        def index
          @appointments = Appointment.includes(:user)

          # Filters
          @appointments = @appointments.where(status: params[:status]) if params[:status].present?
          @appointments = @appointments.where(preferred_language: params[:language]) if params[:language].present?

          # Order by most recent first
          @appointments = @appointments.order(created_at: :desc)

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min

          @appointments = @appointments.page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @appointments,
              each_serializer: AppointmentSerializer
            ).as_json,
            'Appointments retrieved successfully',
            meta: pagination_meta(@appointments)
          )
        end

        # GET /api/v1/admin/appointments/:id
        def show
          render_success(
            AppointmentSerializer.new(@appointment).as_json,
            'Appointment retrieved successfully'
          )
        end

        # PATCH /api/v1/admin/appointments/:id
        def update
          if @appointment.update(appointment_params)
            log_activity('update', 'Appointment', @appointment.id, {
              status: @appointment.status,
              name: @appointment.name
            }) if respond_to?(:log_activity)

            render_success(
              AppointmentSerializer.new(@appointment).as_json,
              'Appointment updated successfully'
            )
          else
            render_error('Failed to update appointment', @appointment.errors.full_messages)
          end
        end

        private

        def set_appointment
          @appointment = Appointment.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Appointment not found', nil, status: :not_found)
        end

        def appointment_params
          params.require(:appointment).permit(:status)
        end
      end
    end
  end
end
