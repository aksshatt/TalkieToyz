module Api
  module V1
    class PatientConversationsController < BaseController
      before_action :authenticate_user!

      # GET /api/v1/patient/conversations
      def index
        conversations = Conversation
          .where(patient_id: current_user.id)
          .includes(:therapist, :messages)
          .recent

        data = conversations.map { |c| serialize_conversation(c) }
        render json: { success: true, data: data }
      end

      # GET /api/v1/patient/conversations/:id
      def show
        conv = Conversation.find_by(id: params[:id], patient_id: current_user.id)
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

      # POST /api/v1/patient/conversations/:id/messages  — patient replies
      def create_message
        conv = Conversation.find_by(id: params[:id], patient_id: current_user.id)
        return render json: { success: false, message: 'Conversation not found' }, status: :not_found unless conv

        msg = conv.messages.build(
          sender: current_user,
          message_type: 'text',
          content: params[:content]
        )

        if msg.save
          notify_therapist_and_admin(conv, msg)
          render json: { success: true, data: serialize_message(msg) }, status: :created
        else
          render json: { success: false, errors: msg.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/patient/conversations/:id/read
      def mark_read
        conv = Conversation.find_by(id: params[:id], patient_id: current_user.id)
        return render json: { success: false, message: 'Not found' }, status: :not_found unless conv
        conv.mark_read_for(current_user)
        render json: { success: true }
      end

      private

      def notify_therapist_and_admin(conv, msg)
        begin
          TherapistMailer.new_message_notification(conv.therapist, conv, msg).deliver_later
        rescue => e
          Rails.logger.error("Therapist notification failed: #{e.message}")
        end

        admin = User.find_by(role: :admin)
        if admin
          begin
            TherapistMailer.admin_message_notification(admin, conv, msg).deliver_later
          rescue => e
            Rails.logger.error("Admin notification failed: #{e.message}")
          end
        end
      end

      def serialize_conversation(c)
        last_msg = c.messages.order(created_at: :desc).first
        {
          id: c.id,
          therapist: { id: c.therapist_id, name: c.therapist&.name, avatar_url: c.therapist&.avatar_url },
          last_message: last_msg ? { content: last_msg.content, message_type: last_msg.message_type, created_at: last_msg.created_at } : nil,
          unread_by_patient: c.unread_by_patient,
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
