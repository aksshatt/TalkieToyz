class NewsletterSubscription < ApplicationRecord
  # Enums
  enum status: {
    pending: 'pending',
    active: 'active',
    unsubscribed: 'unsubscribed'
  }, _prefix: true

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true
  validates :subscription_token, presence: true, uniqueness: true

  # Callbacks
  before_validation :generate_subscription_token, if: -> { subscription_token.blank? }
  before_validation :normalize_email

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :pending, -> { where(status: :pending) }
  scope :unsubscribed, -> { where(status: :unsubscribed) }
  scope :recent, -> { order(created_at: :desc) }

  # Methods
  def confirm!
    update(
      status: :active,
      confirmed_at: Time.current,
      unsubscribed_at: nil
    )
  end

  def unsubscribe!
    update(
      status: :unsubscribed,
      unsubscribed_at: Time.current
    )
  end

  def resubscribe!
    update(
      status: :active,
      confirmed_at: Time.current,
      unsubscribed_at: nil
    )
  end

  def confirmed?
    status_active? && confirmed_at.present?
  end

  def unsubscribed?
    status_unsubscribed?
  end

  def pending_confirmation?
    status_pending?
  end

  private

  def generate_subscription_token
    loop do
      self.subscription_token = SecureRandom.urlsafe_base64(32)
      break unless NewsletterSubscription.exists?(subscription_token: subscription_token)
    end
  end

  def normalize_email
    self.email = email.to_s.downcase.strip if email.present?
  end
end
