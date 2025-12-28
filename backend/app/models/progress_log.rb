class ProgressLog < ApplicationRecord
  include PgSearch::Model

  # Associations
  belongs_to :user
  belongs_to :milestone, optional: true
  belongs_to :product, optional: true

  # Enums
  enum category: {
    expressive_language: 'expressive_language',
    receptive_language: 'receptive_language',
    articulation: 'articulation',
    social_communication: 'social_communication',
    fluency: 'fluency',
    voice: 'voice',
    feeding_swallowing: 'feeding_swallowing',
    general_progress: 'general_progress'
  }, _prefix: true

  # Validations
  validates :child_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :child_age_months, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 240 }
  validates :log_date, presence: true
  validates :category, presence: true

  # Callbacks
  before_validation :set_default_log_date, if: -> { log_date.nil? }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { child_name: 'A', notes: 'B' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(deleted_at: nil) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_child, ->(child_name) { where(child_name: child_name) }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_date_range, ->(start_date, end_date) { where(log_date: start_date..end_date) }
  scope :recent, -> { order(log_date: :desc, created_at: :desc) }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }

  # Methods
  def soft_delete
    update(deleted_at: Time.current)
  end

  def restore
    update(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end

  def category_display_name
    category.to_s.titleize
  end

  def age_display
    years = child_age_months / 12
    months = child_age_months % 12

    if years.zero?
      "#{months} #{months == 1 ? 'month' : 'months'}"
    elsif months.zero?
      "#{years} #{years == 1 ? 'year' : 'years'}"
    else
      "#{years} #{years == 1 ? 'year' : 'years'}, #{months} #{months == 1 ? 'month' : 'months'}"
    end
  end

  private

  def set_default_log_date
    self.log_date = Date.current
  end
end
