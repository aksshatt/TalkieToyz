class ReviewRateLimit < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :review_date, presence: true
  validates :user_id, uniqueness: { scope: :review_date }

  # Class methods for rate limiting
  def self.can_review?(user)
    return true unless user

    today = Date.current
    limit = find_or_create_by(user: user, review_date: today)
    limit.count < 5
  end

  def self.increment_for(user)
    return unless user

    today = Date.current
    limit = find_or_create_by(user: user, review_date: today)
    limit.increment!(:count)
  end
end
