module Api
  module V1
    module Admin
      class ContactSubmissionsController < BaseController
        before_action :set_submission, only: [:show, :update]

        # GET /api/v1/admin/contact_submissions
        def index
          @submissions = ContactSubmission.all

          # Filters
          @submissions = @submissions.by_status(params[:status]) if params[:status].present?

          # Order
          @submissions = @submissions.recent

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min

          @submissions = @submissions.page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @submissions,
              each_serializer: ContactSubmissionSerializer
            ).as_json,
            'Contact submissions retrieved successfully',
            meta: pagination_meta(@submissions)
          )
        end

        # GET /api/v1/admin/contact_submissions/:id
        def show
          render_success(
            ContactSubmissionSerializer.new(@submission).as_json,
            'Contact submission retrieved successfully'
          )
        end

        # PATCH /api/v1/admin/contact_submissions/:id
        def update
          if @submission.update(submission_params)
            log_activity('update', 'ContactSubmission', @submission.id, {
              status: @submission.status,
              subject: @submission.subject
            }) if respond_to?(:log_activity)

            render_success(
              ContactSubmissionSerializer.new(@submission).as_json,
              'Contact submission updated successfully'
            )
          else
            render_error('Failed to update contact submission', @submission.errors.full_messages)
          end
        end

        # GET /api/v1/admin/contact_submissions/statistics
        def statistics
          stats = {
            total: ContactSubmission.count,
            pending: ContactSubmission.status_pending.count,
            in_progress: ContactSubmission.status_in_progress.count,
            resolved: ContactSubmission.status_resolved.count,
            spam: ContactSubmission.status_spam.count,
            today: ContactSubmission.where('created_at >= ?', Time.current.beginning_of_day).count,
            this_week: ContactSubmission.where('created_at >= ?', Time.current.beginning_of_week).count,
            this_month: ContactSubmission.where('created_at >= ?', Time.current.beginning_of_month).count
          }

          render_success(stats, 'Statistics retrieved successfully')
        end

        private

        def set_submission
          @submission = ContactSubmission.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Contact submission not found', nil, status: :not_found)
        end

        def submission_params
          params.require(:contact_submission).permit(
            :status,
            :admin_notes,
            :responded_at
          )
        end
      end
    end
  end
end
