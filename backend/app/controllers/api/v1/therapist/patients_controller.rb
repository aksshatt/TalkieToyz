module Api
  module V1
    module Therapist
      class PatientsController < BaseController
        # GET /api/v1/therapist/patients
        def index
          assignments = TherapistPatientAssignment
            .active
            .where(therapist_id: current_user.id)
            .includes(:patient)
            .order(created_at: :desc)

          patients = assignments.map do |a|
            patient = a.patient
            conversation = Conversation.find_by(therapist_id: current_user.id, patient_id: patient.id)
            {
              id: patient.id,
              name: patient.name,
              email: patient.email,
              phone: patient.phone,
              avatar_url: patient.avatar_url,
              assigned_at: a.created_at,
              notes: a.notes,
              unread_messages: conversation&.unread_by_therapist || 0,
              last_message_at: conversation&.last_message_at,
              conversation_id: conversation&.id
            }
          end

          render json: { success: true, data: patients }
        end

        # GET /api/v1/therapist/patients/:id
        def show
          patient = assigned_patient(params[:id])
          return render json: { success: false, message: 'Patient not found' }, status: :not_found unless patient

          # Assessment results
          assessment_results = AssessmentResult
            .where(user_id: patient.id)
            .includes(:assessment)
            .order(created_at: :desc)
            .limit(10)
            .map do |r|
              {
                id: r.id,
                assessment_title: r.assessment&.title,
                assessment_slug: r.assessment&.slug,
                child_name: r.child_name,
                percentage_score: r.percentage_score,
                total_score: r.total_score,
                completed_at: r.completed_at,
                recommendations: r.recommendations
              }
            end

          render json: {
            success: true,
            data: {
              id: patient.id,
              name: patient.name,
              email: patient.email,
              phone: patient.phone,
              avatar_url: patient.avatar_url,
              bio: patient.bio,
              created_at: patient.created_at,
              assessment_results: assessment_results
            }
          }
        end

        private

        def assigned_patient(patient_id)
          assignment = TherapistPatientAssignment
            .active
            .find_by(therapist_id: current_user.id, patient_id: patient_id)
          assignment&.patient
        end
      end
    end
  end
end
