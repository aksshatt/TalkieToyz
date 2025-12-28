class ContactSubmission < ApplicationRecord
  # Associations
  belongs_to :user, optional: true

  # Enums
  STATUSES = {
    pending: 'pending',
    in_progress: 'in_progress',
    resolved: 'resolved',
    spam: 'spam'
  }.freeze

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, format: { with: /\A[0-9]{10}\z/ }, allow_blank: true
  validates :subject, presence: true, length: { minimum: 5, maximum: 200 }
  validates :message, presence: true, length: { minimum: 10, maximum: 5000 }
  validates :status, presence: true, inclusion: { in: STATUSES.values }

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_status, ->(status) { where(status: status) }
  scope :unresolved, -> { where(status: [STATUSES[:pending], STATUSES[:in_progress]]) }
  scope :status_pending, -> { where(status: STATUSES[:pending]) }
  scope :status_in_progress, -> { where(status: STATUSES[:in_progress]) }
  scope :status_resolved, -> { where(status: STATUSES[:resolved]) }
  scope :status_spam, -> { where(status: STATUSES[:spam]) }

  # Callbacks
  after_create :send_notification_emails

  def self.statuses
    STATUSES
  end

  private

  def send_notification_emails
    # Send to admin
    ContactMailer.admin_notification(id).deliver_later(queue: 'mailers')

    # Send auto-reply to user
    ContactMailer.user_confirmation(id).deliver_later(queue: 'mailers')
  end
end
