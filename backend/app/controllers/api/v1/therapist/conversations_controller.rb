module Api
  module V1
    module Therapist
      class ConversationsController < BaseController
        # GET /api/v1/therapist/conversations
        def index
          conversations = Conversation
            .where(therapist_id: current_user.id)
            .includes(:patient, :messages)
            .recent

          data = conversations.map { |c| serialize_conversation(c) }
          render json: { success: true, data: data }
        end

        # GET /api/v1/therapist/conversations/:id  (or by patient_id)
        def show
          conv = find_conversation
          return render json: { success: false, message: 'Conversation not found' }, status: :not_found unless conv

          conv.mark_read_for(current_user)
          messages = conv.messages.chronological.map { |m| serialize_message(m) }

          render json: {
            success: true,
            data: {
              conversation: serialize_conversation(conv),
              messages: messages
            }
          }
        end

        # POST /api/v1/therapist/conversations  — get or create conversation with a patient
        def create
          patient = User.find_by(id: params[:patient_id])
          return render json: { success: false, message: 'Patient not found' }, status: :not_found unless patient

          # Verify assignment
          unless TherapistPatientAssignment.active.exists?(therapist_id: current_user.id, patient_id: patient.id)
            return render json: { success: false, message: 'Patient not assigned to you' }, status: :forbidden
          end

          conv = Conversation.between(current_user.id, patient.id)
          render json: { success: true, data: serialize_conversation(conv) }
        end

        private

        def find_conversation
          Conversation.find_by(id: params[:id], therapist_id: current_user.id)
        end

        def serialize_conversation(c)
          last_msg = c.messages.order(created_at: :desc).first
          {
            id: c.id,
            patient: { id: c.patient_id, name: c.patient&.name, avatar_url: c.patient&.avatar_url },
            last_message: last_msg ? { content: last_msg.content, message_type: last_msg.message_type, created_at: last_msg.created_at } : nil,
            unread_by_therapist: c.unread_by_therapist,
            last_message_at: c.last_message_at,
            created_at: c.created_at
          }
        end

        def serialize_message(m)
          {
            id: m.id,
            sender_id: m.sender_id,
            sender_name: m.sender&.name,
            sender_role: m.sender&.role,
            message_type: m.message_type,
            content: m.content,
            metadata: m.metadata,
            read_at: m.read_at,
            created_at: m.created_at
          }
        end
      end
    end
  end
end
