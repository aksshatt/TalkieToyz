class ReviewHelpfulVote < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :review

  # Validations
  validates :user_id, uniqueness: { scope: :review_id, message: 'has already marked this review as helpful' }
end
