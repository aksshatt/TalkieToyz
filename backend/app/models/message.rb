class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :sender, class_name: 'User'

  TYPES = %w[text product assessment].freeze

  validates :message_type, inclusion: { in: TYPES }
  validates :content, presence: true, if: -> { message_type == 'text' }
  validates :metadata, presence: true, if: -> { %w[product assessment].include?(message_type) }

  scope :chronological, -> { order(created_at: :asc) }

  after_create :update_conversation

  private

  def update_conversation
    conv = conversation
    conv.update(last_message_at: created_at)

    # Determine recipient and increment their unread
    recipient = sender_id == conv.therapist_id ? conv.patient : conv.therapist
    conv.increment_unread_for(recipient)
  end
end
