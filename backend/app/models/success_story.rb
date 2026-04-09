class SuccessStory < ApplicationRecord
  belongs_to :user
  belongs_to :product, optional: true

  validates :child_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :before_text, presence: true, length: { minimum: 20 }
  validates :after_text, presence: true, length: { minimum: 20 }

  scope :approved, -> { where(approved: true) }
  scope :featured, -> { where(featured: true) }
  scope :for_product, ->(product_id) { where(product_id: product_id) }
end
