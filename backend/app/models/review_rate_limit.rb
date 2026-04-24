class ReviewRateLimit < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :review_date, presence: true
  validates :user_id, uniqueness: { scope: :review_date }

  # Class methods for rate limiting

  # DB-level unique index on (user_id, review_date) backs the uniqueness
  # validation, so find_or_create_by can still raise under concurrent access.
  def self.find_or_create_for(user, date)
    find_or_create_by(user: user, review_date: date)
  rescue ActiveRecord::RecordNotUnique
    find_by(user: user, review_date: date)
  end

  def self.can_review?(user)
    return true unless user

    limit = find_or_create_for(user, Date.current)
    limit.count < 5
  end

  def self.increment_for(user)
    return unless user

    limit = find_or_create_for(user, Date.current)
    limit.increment!(:count)
  end
end
