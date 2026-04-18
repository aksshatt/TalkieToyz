module Api
  module V1
    module Admin
      class TherapistAssignmentsController < BaseController
        # GET /api/v1/admin/therapist_assignments
        # Lists all assignments; optionally filter by therapist_id or patient_id
        def index
          assignments = TherapistPatientAssignment.includes(:therapist, :patient, :assigned_by)
          assignments = assignments.where(therapist_id: params[:therapist_id]) if params[:therapist_id].present?
          assignments = assignments.where(patient_id:   params[:patient_id])   if params[:patient_id].present?
          assignments = assignments.active if params[:active] != 'false'
          assignments = assignments.order(created_at: :desc)

          render json: {
            success: true,
            data: assignments.map { |a| serialize(a) }
          }
        end

        # GET /api/v1/admin/therapist_assignments/therapists
        # Returns all approved therapists with their patient count
        def therapists
          therapists = User.therapist.where(approval_status: 'approved').order(:name)
          data = therapists.map do |t|
            {
              id: t.id, name: t.name, email: t.email, avatar_url: t.avatar_url,
              patient_count: TherapistPatientAssignment.active.where(therapist_id: t.id).count
            }
          end
          render json: { success: true, data: data }
        end

        # GET /api/v1/admin/therapist_assignments/patients
        # Returns all customers (potential patients)
        def patients
          patients = User.customer.active.order(:name)
          data = patients.map do |p|
            assignment = TherapistPatientAssignment.active.find_by(patient_id: p.id)
            {
              id: p.id, name: p.name, email: p.email, avatar_url: p.avatar_url,
              assigned_therapist_id:   assignment&.therapist_id,
              assigned_therapist_name: assignment&.therapist&.name
            }
          end
          render json: { success: true, data: data }
        end

        # POST /api/v1/admin/therapist_assignments
        def create
          therapist = User.therapist.find_by(id: params[:therapist_id])
          patient   = User.customer.find_by(id: params[:patient_id])

          return render json: { success: false, message: 'Therapist not found' }, status: :not_found unless therapist
          return render json: { success: false, message: 'Patient not found' },   status: :not_found unless patient

          assignment = TherapistPatientAssignment.find_or_initialize_by(
            therapist_id: therapist.id,
            patient_id:   patient.id
          )
          assignment.assigned_by = current_user
          assignment.notes  = params[:notes]
          assignment.active = true

          if assignment.save
            log_activity('assign_patient', 'TherapistPatientAssignment', assignment.id,
                         { therapist: therapist.name, patient: patient.name })

            begin
              TherapistMailer.patient_assigned(therapist, patient).deliver_later
            rescue => e
              Rails.logger.error("Assignment email failed: #{e.message}")
            end

            render json: { success: true, data: serialize(assignment) }, status: :created
          else
            render json: { success: false, errors: assignment.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/admin/therapist_assignments/:id
        def destroy
          assignment = TherapistPatientAssignment.find_by(id: params[:id])
          return render json: { success: false, message: 'Assignment not found' }, status: :not_found unless assignment

          assignment.update(active: false)
          log_activity('unassign_patient', 'TherapistPatientAssignment', assignment.id,
                       { therapist: assignment.therapist&.name, patient: assignment.patient&.name })

          render json: { success: true, message: 'Assignment removed.' }
        end

        private

        def serialize(a)
          {
            id: a.id,
            therapist_id:    a.therapist_id,
            therapist_name:  a.therapist&.name,
            therapist_email: a.therapist&.email,
            patient_id:      a.patient_id,
            patient_name:    a.patient&.name,
            patient_email:   a.patient&.email,
            assigned_by: a.assigned_by&.name,
            notes: a.notes,
            active: a.active,
            created_at: a.created_at
          }
        end
      end
    end
  end
end
