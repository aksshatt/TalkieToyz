module Api
  module V1
    module Admin
      class TherapistApprovalsController < BaseController
        # GET /api/v1/admin/therapist_approvals
        def index
          therapists = User.where(role: :therapist)
          therapists = therapists.where(approval_status: params[:status]) if params[:status].present?
          therapists = therapists.order(created_at: :desc)

          render json: {
            success: true,
            data: therapists.map { |t| serialize(t) },
            counts: {
              pending:  User.therapist.where(approval_status: 'pending').count,
              approved: User.therapist.where(approval_status: 'approved').count,
              rejected: User.therapist.where(approval_status: 'rejected').count
            }
          }
        end

        # POST /api/v1/admin/therapist_approvals/:id/approve
        def approve
          therapist = User.therapist.find_by(id: params[:id])
          return render json: { success: false, message: 'Therapist not found' }, status: :not_found unless therapist

          therapist.update!(approval_status: 'approved')
          log_activity('approve_therapist', 'User', therapist.id, { therapist_name: therapist.name })

          begin
            TherapistMailer.approved(therapist).deliver_later
          rescue => e
            Rails.logger.error("Approval email failed: #{e.message}")
          end

          render json: { success: true, message: "#{therapist.name} has been approved.", data: serialize(therapist) }
        end

        # POST /api/v1/admin/therapist_approvals/:id/reject
        def reject
          therapist = User.therapist.find_by(id: params[:id])
          return render json: { success: false, message: 'Therapist not found' }, status: :not_found unless therapist

          therapist.update!(approval_status: 'rejected')
          log_activity('reject_therapist', 'User', therapist.id, { therapist_name: therapist.name, reason: params[:reason] })

          begin
            TherapistMailer.rejected(therapist, params[:reason]).deliver_later
          rescue => e
            Rails.logger.error("Rejection email failed: #{e.message}")
          end

          render json: { success: true, message: "#{therapist.name} has been rejected.", data: serialize(therapist) }
        end

        private

        def serialize(t)
          {
            id: t.id, name: t.name, email: t.email, phone: t.phone,
            bio: t.bio, avatar_url: t.avatar_url,
            approval_status: t.approval_status,
            created_at: t.created_at
          }
        end
      end
    end
  end
end
