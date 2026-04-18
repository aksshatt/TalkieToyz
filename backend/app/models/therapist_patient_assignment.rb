class TherapistPatientAssignment < ApplicationRecord
  belongs_to :therapist, class_name: 'User'
  belongs_to :patient,   class_name: 'User'
  belongs_to :assigned_by, class_name: 'User'

  validates :therapist_id, uniqueness: { scope: :patient_id, message: 'Patient already assigned to this therapist' }
  validate :therapist_must_be_therapist
  validate :patient_must_be_customer

  scope :active, -> { where(active: true) }

  private

  def therapist_must_be_therapist
    errors.add(:therapist, 'must have therapist role') unless therapist&.therapist?
  end

  def patient_must_be_customer
    errors.add(:patient, 'must be a customer/patient') unless patient&.customer?
  end
end
