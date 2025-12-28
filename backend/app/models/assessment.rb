class Assessment < ApplicationRecord
  include PgSearch::Model

  # Associations
  has_many :assessment_results, dependent: :destroy

  # Validations
  validates :title, presence: true, length: { minimum: 2, maximum: 200 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :min_age, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }
  validates :max_age, numericality: { only_integer: true, greater_than: :min_age, allow_nil: true }, if: -> { min_age.present? }
  validates :questions, presence: true
  validates :version, numericality: { only_integer: true, greater_than: 0 }
  validate :questions_structure

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { title: 'A', description: 'B' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(active: true, deleted_at: nil) }
  scope :by_age_range, ->(age) { where('min_age <= ? AND (max_age >= ? OR max_age IS NULL)', age, age) }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }
  scope :latest_versions, -> { select('DISTINCT ON (title) *').order(:title, version: :desc) }

  # Methods
  def calculate_score(answers)
    return 0 if answers.blank? || scoring_rules.blank?

    total = 0
    scoring_rules.each do |rule|
      question_key = rule['question_key']
      answer = answers[question_key]

      next if answer.blank?

      case rule['scoring_type']
      when 'points'
        total += rule['points'][answer].to_i if rule['points'].is_a?(Hash)
      when 'boolean'
        total += rule['points'].to_i if answer.to_s == 'yes' || answer == true
      when 'scale'
        total += answer.to_i
      end
    end

    total
  end

  def generate_recommendations(score)
    return {} if recommendations.blank?

    recommendations.find { |rec| score >= rec['min_score'] && score <= rec['max_score'] } || {}
  end

  def soft_delete
    update(deleted_at: Time.current, active: false)
  end

  private

  def generate_slug
    self.slug = title.parameterize if title.present?
  end

  def questions_structure
    return if questions.blank?

    unless questions.is_a?(Array)
      errors.add(:questions, 'must be an array')
      return
    end

    questions.each_with_index do |question, index|
      unless question.is_a?(Hash)
        errors.add(:questions, "question at index #{index} must be a hash")
        next
      end

      unless question['key'].present?
        errors.add(:questions, "question at index #{index} must have a 'key'")
      end

      unless question['text'].present?
        errors.add(:questions, "question at index #{index} must have 'text'")
      end

      unless question['type'].present?
        errors.add(:questions, "question at index #{index} must have a 'type'")
      end
    end
  end
end
