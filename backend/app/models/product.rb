class Product < ApplicationRecord
  include PgSearch::Model

  # ActiveStorage
  has_many_attached :images

  # Associations
  belongs_to :category, optional: true
  has_many :product_speech_goals, dependent: :destroy
  has_many :speech_goals, through: :product_speech_goals
  has_many :product_variants, dependent: :destroy
  has_many :cart_items, dependent: :destroy
  has_many :order_items, dependent: :destroy
  has_many :reviews, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 200 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :stock_quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :sku, uniqueness: { allow_blank: true }
  validates :min_age, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }
  validates :max_age, numericality: { only_integer: true, greater_than: :min_age, allow_nil: true }, if: -> { min_age.present? }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }
  before_validation :generate_sku, if: -> { sku.blank? }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { name: 'A', description: 'B', long_description: 'C' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(active: true, deleted_at: nil) }
  scope :featured, -> { where(featured: true) }
  scope :in_stock, -> { where('stock_quantity > ?', 0) }
  scope :by_category, ->(category_id) { where(category_id: category_id) }
  scope :by_age_range, ->(age) { where('min_age <= ? AND max_age >= ?', age, age) }
  scope :by_price_range, ->(min_price, max_price) { where(price: min_price..max_price) }
  scope :by_speech_goals, ->(goal_ids) { joins(:speech_goals).where(speech_goals: { id: goal_ids }).distinct }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }

  # Methods
  def in_stock?
    stock_quantity > 0
  end

  def on_sale?
    compare_at_price.present? && compare_at_price > price
  end

  def discount_percentage
    return 0 unless on_sale?

    ((compare_at_price - price) / compare_at_price * 100).round
  end

  def average_rating
    reviews.average(:rating).to_f.round(2)
  end

  def soft_delete
    update(deleted_at: Time.current, active: false)
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present?
  end

  def generate_sku
    self.sku = "TOY-#{SecureRandom.alphanumeric(8).upcase}"
  end
end
