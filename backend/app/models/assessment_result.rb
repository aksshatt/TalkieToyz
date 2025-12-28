class AssessmentResult < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :assessment

  # Validations
  validates :child_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :child_age_months, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 240 }
  validates :answers, presence: true
  validate :answers_structure

  # Callbacks
  before_save :calculate_scores, if: :answers_changed?
  before_save :generate_recommendations, if: :scores_changed?
  before_save :set_completed_at, if: -> { completed_at.nil? && answers.present? }

  # Scopes
  scope :completed, -> { where.not(completed_at: nil) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_assessment, ->(assessment_id) { where(assessment_id: assessment_id) }
  scope :by_child, ->(child_name) { where(child_name: child_name) }
  scope :recent, -> { order(completed_at: :desc) }

  # Methods
  def complete?
    completed_at.present?
  end

  def percentage_score
    return 0 if total_score.zero? || assessment.blank?

    max_score = calculate_max_possible_score
    return 0 if max_score.zero?

    ((total_score.to_f / max_score) * 100).round(2)
  end

  private

  def calculate_scores
    return unless assessment.present? && answers.present?

    self.total_score = assessment.calculate_score(answers)

    # Calculate category-level scores if scoring_rules include categories
    if assessment.scoring_rules.present? && assessment.scoring_rules.is_a?(Array)
      category_scores = {}

      assessment.scoring_rules.each do |rule|
        category = rule['category'] || 'general'
        question_key = rule['question_key']
        answer = answers[question_key]

        next if answer.blank?

        category_scores[category] ||= 0

        case rule['scoring_type']
        when 'points'
          category_scores[category] += rule['points'][answer].to_i if rule['points'].is_a?(Hash)
        when 'boolean'
          category_scores[category] += rule['points'].to_i if answer.to_s == 'yes' || answer == true
        when 'scale'
          category_scores[category] += answer.to_i
        end
      end

      self.scores = category_scores
    end
  end

  def generate_recommendations
    return unless assessment.present? && total_score.present?

    self.recommendations = assessment.generate_recommendations(total_score)
  end

  def set_completed_at
    self.completed_at = Time.current
  end

  def answers_structure
    return if answers.blank?

    unless answers.is_a?(Hash)
      errors.add(:answers, 'must be a hash')
      return
    end

    if assessment.present? && assessment.questions.present?
      assessment.questions.each do |question|
        question_key = question['key']
        unless answers.key?(question_key)
          errors.add(:answers, "missing answer for question '#{question_key}'")
        end
      end
    end
  end

  def calculate_max_possible_score
    return 0 unless assessment.present? && assessment.scoring_rules.present?

    max_score = 0

    assessment.scoring_rules.each do |rule|
      case rule['scoring_type']
      when 'points'
        max_score += rule['points'].values.max.to_i if rule['points'].is_a?(Hash)
      when 'boolean'
        max_score += rule['points'].to_i
      when 'scale'
        max_score += rule['max_value'].to_i
      end
    end

    max_score
  end
end
