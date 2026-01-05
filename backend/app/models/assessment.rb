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
    return 0 if answers.blank? || questions.blank?

    total = 0
    questions.each do |question|
      question_key = question['key']
      answer = answers[question_key]

      next if answer.blank?

      case question['type']
      when 'yes_no'
        total += question['points'][answer.to_s].to_i if question['points'].is_a?(Hash)
      when 'multiple_choice'
        if question['options'].is_a?(Array)
          # Handle both cases: answer as string value or as object with 'value' key
          answer_value = answer.is_a?(Hash) ? answer['value'] : answer
          selected_option = question['options'].find { |opt| opt['value'] == answer_value }
          total += selected_option['points'].to_i if selected_option
        end
      when 'scale'
        points_per_level = question['points_per_level'] || 1
        total += (answer.to_i * points_per_level)
      end
    end

    total
  end

  def generate_recommendations(score)
    return {} if scoring_rules.blank? || recommendations.blank?

    # Find the score range/level from scoring_rules
    score_level = scoring_rules.find do |rule|
      min_score = rule['min_score'] || 0
      max_score = rule['max_score'] || Float::INFINITY
      score >= min_score && score <= max_score
    end

    return {} unless score_level

    # Find the recommendation for that level
    level = score_level['level']
    recommendations.find { |rec| rec['level'] == level } || {}
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
