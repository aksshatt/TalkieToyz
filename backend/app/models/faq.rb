class Faq < ApplicationRecord
  include PgSearch::Model

  # Enums
  CATEGORIES = {
    general: 'general',
    products: 'products',
    shipping: 'shipping',
    orders: 'orders',
    returns: 'returns',
    therapy: 'therapy',
    assessments: 'assessments'
  }.freeze

  # Callbacks
  after_save :clear_faq_cache
  after_destroy :clear_faq_cache

  # Validations
  validates :question, presence: true, length: { minimum: 5, maximum: 500 }
  validates :answer, presence: true, length: { minimum: 10, maximum: 5000 }
  validates :category, presence: true, inclusion: { in: CATEGORIES.values }
  validates :display_order, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { question: 'A', answer: 'B' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(active: true, deleted_at: nil) }
  scope :by_category, ->(category) { where(category: category) }
  scope :ordered, -> { order(display_order: :asc, created_at: :desc) }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }

  # Methods
  def increment_view_count
    increment!(:view_count)
  end

  def soft_delete
    update(deleted_at: Time.current, active: false)
  end

  def category_display_name
    category.to_s.titleize
  end

  def self.categories
    CATEGORIES
  end

  private

  def clear_faq_cache
    Rails.cache.delete('faq_categories')
  end
end
