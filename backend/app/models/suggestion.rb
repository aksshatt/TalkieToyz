class Suggestion < ApplicationRecord
  validates :message, presence: true, length: { minimum: 3, maximum: 2000 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true

  scope :recent, -> { order(created_at: :desc) }
  scope :unreviewed, -> { where(reviewed: false) }
end
