class Milestone < ApplicationRecord
  include PgSearch::Model

  # Associations
  has_many :progress_logs, dependent: :nullify

  # Enums
  enum category: {
    expressive_language: 'expressive_language',
    receptive_language: 'receptive_language',
    articulation: 'articulation',
    social_communication: 'social_communication',
    fluency: 'fluency',
    voice: 'voice',
    feeding_swallowing: 'feeding_swallowing'
  }, _prefix: true

  # Validations
  validates :title, presence: true, length: { minimum: 2, maximum: 200 }
  validates :category, presence: true
  validates :age_months_min, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :age_months_max, presence: true, numericality: { only_integer: true, greater_than: :age_months_min }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { title: 'A', description: 'B' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(active: true) }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_age, ->(age_months) { where('age_months_min <= ? AND age_months_max >= ?', age_months, age_months) }
  scope :by_age_range, ->(min_age, max_age) { where('age_months_max >= ? AND age_months_min <= ?', min_age, max_age) }
  scope :ordered, -> { order(:age_months_min, :position, :title) }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }

  # Methods
  def age_range_description
    "#{age_months_min}-#{age_months_max} months"
  end

  def age_range_years
    min_years = (age_months_min / 12.0).floor
    max_years = (age_months_max / 12.0).floor

    if min_years == max_years
      "#{min_years} #{min_years == 1 ? 'year' : 'years'}"
    else
      "#{min_years}-#{max_years} years"
    end
  end

  def category_display_name
    category.to_s.titleize
  end
end
