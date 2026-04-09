class Bundle < ApplicationRecord
  has_many :bundle_items, -> { order(:position) }, dependent: :destroy
  has_many :products, through: :bundle_items

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :discount_percent, numericality: { greater_than: 0, less_than_or_equal_to: 50 }

  before_validation :generate_slug, if: -> { slug.blank? }

  scope :active, -> { where(active: true) }
  scope :featured, -> { where(featured: true) }

  def original_price
    products.sum(:price)
  end

  def discounted_price
    (original_price * (1 - discount_percent / 100.0)).round(2)
  end

  def savings
    (original_price - discounted_price).round(2)
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present?
  end
end
