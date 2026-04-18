module Api
  module V1
    module Admin
      class ConversationsController < BaseController
        # GET /api/v1/admin/conversations
        def index
          conversations = Conversation
            .includes(:therapist, :patient, :messages)
            .recent

          conversations = conversations.where(therapist_id: params[:therapist_id]) if params[:therapist_id].present?
          conversations = conversations.where(patient_id:   params[:patient_id])   if params[:patient_id].present?

          render json: {
            success: true,
            data: conversations.map { |c| serialize_conversation(c) }
          }
        end

        # GET /api/v1/admin/conversations/:id
        def show
          conv = Conversation.includes(:therapist, :patient, messages: :sender).find_by(id: params[:id])
          return render json: { success: false, message: 'Conversation not found' }, status: :not_found unless conv

          messages = conv.messages.chronological.map { |m| serialize_message(m) }

          render json: {
            success: true,
            data: {
              conversation: serialize_conversation(conv),
              messages: messages
            }
          }
          # NOTE: Admin reads are intentionally NOT marked as read — therapist never knows
        end

        private

        def serialize_conversation(c)
          last_msg = c.messages.order(created_at: :desc).first
          {
            id: c.id,
            therapist_id:   c.therapist_id,
            therapist_name: c.therapist&.name,
            patient_id:     c.patient_id,
            patient_name:   c.patient&.name,
            message_count: c.messages.count,
            unread_by_therapist: c.unread_by_therapist,
            unread_by_patient: c.unread_by_patient,
            last_message: last_msg ? { content: last_msg.content, message_type: last_msg.message_type, created_at: last_msg.created_at, sender: last_msg.sender&.name } : nil,
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
