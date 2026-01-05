class Review < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :product
  belongs_to :admin_responder, class_name: 'User', optional: true
  has_many :helpful_votes, class_name: 'ReviewHelpfulVote', dependent: :destroy

  # Active Storage
  has_many_attached :photos

  # Validations
  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :product_id, message: 'can only review a product once' }
  validates :comment, length: { maximum: 1000 }
  validates :photos, content_type: ['image/png', 'image/jpeg'],
                     size: { less_than: 5.megabytes },
                     limit: { max: 3 }
  validates :admin_response, length: { maximum: 2000 }, allow_blank: true

  # Scopes
  scope :approved, -> { where(approved: true, deleted_at: nil) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_rating, ->(rating) { where(rating: rating) }
  scope :verified, -> { where(verified_purchase: true) }
  scope :with_photos, -> { joins(:photos_attachments).distinct }
  scope :most_helpful, -> { order(helpful_count: :desc) }
  scope :highest_rated, -> { order(rating: :desc) }
  scope :lowest_rated, -> { order(rating: :asc) }

  # Methods
  def approve!
    update(approved: true)
  end

  def soft_delete
    update(deleted_at: Time.current)
  end

  def verified_purchase?
    return verified_purchase if verified_purchase.present?

    # Auto-check if user has delivered order with this product
    user.orders.delivered
        .joins(:order_items)
        .exists?(order_items: { product_id: product_id })
  end

  def mark_helpful_by(user)
    return false if helpful_votes.exists?(user: user)

    helpful_votes.create(user: user)
    increment!(:helpful_count)
    true
  end

  def unmark_helpful_by(user)
    vote = helpful_votes.find_by(user: user)
    return false unless vote

    vote.destroy
    decrement!(:helpful_count)
    true
  end

  def has_admin_response?
    admin_response.present?
  end

  def add_admin_response(response_text, admin_user)
    update(
      admin_response: response_text,
      admin_responder: admin_user,
      admin_responded_at: Time.current
    )
  end
end
