class Conversation < ApplicationRecord
  belongs_to :therapist, class_name: 'User'
  belongs_to :patient,   class_name: 'User'
  has_many :messages, dependent: :destroy

  validates :therapist_id, uniqueness: { scope: :patient_id }

  scope :recent, -> { order(last_message_at: :desc) }

  def self.between(therapist_id, patient_id)
    find_or_create_by(therapist_id: therapist_id, patient_id: patient_id)
  rescue ActiveRecord::RecordNotUnique
    # Another request raced us to create the same conversation; re-read it.
    find_by(therapist_id: therapist_id, patient_id: patient_id)
  end

  def mark_read_for(user)
    if user.therapist?
      update(unread_by_therapist: 0)
    elsif user.customer?
      update(unread_by_patient: 0)
    end
  end

  def increment_unread_for(recipient)
    if recipient.therapist?
      increment!(:unread_by_therapist)
    elsif recipient.customer?
      increment!(:unread_by_patient)
    end
  end
end
