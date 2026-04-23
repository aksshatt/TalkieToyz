module Api
  module V1
    module Therapist
      class MessagesController < BaseController
        before_action :find_conversation

        # POST /api/v1/therapist/conversations/:conversation_id/messages
        ALLOWED_METADATA_KEYS = %w[
          product_id product_slug product_name image_url
          assessment_id assessment_slug assessment_title
        ].freeze

        def create
          msg = @conversation.messages.build(
            sender: current_user,
            message_type: params[:message_type] || 'text',
            content: params[:content],
            metadata: filtered_metadata
          )

          if msg.save
            notify_admin(msg)
            render json: { success: true, data: serialize_message(msg) }, status: :created
          else
            render json: { success: false, errors: msg.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PATCH /api/v1/therapist/conversations/:conversation_id/messages/read
        def mark_read
          @conversation.messages
            .where.not(sender: current_user)
            .where(read_at: nil)
            .update_all(read_at: Time.current)
          @conversation.mark_read_for(current_user)
          render json: { success: true }
        end

        private

        def filtered_metadata
          raw = params[:metadata]
          return {} unless raw.respond_to?(:to_unsafe_h)
          hash = raw.to_unsafe_h.stringify_keys
          hash.slice(*ALLOWED_METADATA_KEYS)
        end

        def find_conversation
          @conversation = Conversation.find_by(id: params[:conversation_id], therapist_id: current_user.id)
          render json: { success: false, message: 'Conversation not found' }, status: :not_found unless @conversation
        end

        def notify_admin(msg)
          # Notify patient
          begin
            TherapistMailer.patient_message_notification(@conversation.patient, @conversation, msg).deliver_later
          rescue => e
            Rails.logger.error("Patient notification failed: #{e.message}")
          end

          # Notify admin (silent monitoring)
          admin = User.find_by(role: :admin)
          return unless admin
          begin
            TherapistMailer.admin_message_notification(admin, @conversation, msg).deliver_later
          rescue => e
            Rails.logger.error("Admin notification failed: #{e.message}")
          end
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
