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
  before_save :calculate_scores_and_recommendations, if: :answers_changed?
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

  def category_max_scores
    return {} unless assessment.present? && assessment.questions.present?

    max_scores = {}

    assessment.questions.each do |question|
      category = question['category'] || 'general'
      max_scores[category] ||= 0

      case question['type']
      when 'yes_no'
        max_scores[category] += question['points'].values.max.to_i if question['points'].is_a?(Hash)
      when 'multiple_choice'
        if question['options'].is_a?(Array)
          max_points = question['options'].map { |opt| opt['points'].to_i }.max || 0
          max_scores[category] += max_points
        end
      when 'scale'
        points_per_level = question['points_per_level'] || 1
        max_value = question['max_value'] || 5
        max_scores[category] += (max_value * points_per_level)
      end
    end

    max_scores
  end

  private

  def calculate_scores_and_recommendations
    calculate_scores
    generate_recommendations_data
  end

  def calculate_scores
    return unless assessment.present? && answers.present?

    self.total_score = assessment.calculate_score(answers)

    # Calculate category-level scores from questions
    if assessment.questions.present? && assessment.questions.is_a?(Array)
      category_scores = {}

      assessment.questions.each do |question|
        category = question['category'] || 'general'
        question_key = question['key']
        answer = answers[question_key]

        next if answer.blank?

        category_scores[category] ||= 0

        case question['type']
        when 'yes_no'
          if question['points'].is_a?(Hash)
            category_scores[category] += question['points'][answer.to_s].to_i
          end
        when 'multiple_choice'
          # For multiple choice, find the selected option's points
          # Handle both cases: answer as string value or as object with 'value' key
          if question['options'].is_a?(Array)
            answer_value = answer.is_a?(Hash) ? answer['value'] : answer
            selected_option = question['options'].find { |opt| opt['value'] == answer_value }
            category_scores[category] += selected_option['points'].to_i if selected_option
          end
        when 'scale'
          # For scale questions, calculate points based on the answer value
          points_per_level = question['points_per_level'] || 1
          category_scores[category] += (answer.to_i * points_per_level)
        end
      end

      self.scores = category_scores
    end
  end

  def generate_recommendations_data
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
    return 0 unless assessment.present? && assessment.questions.present?

    max_score = 0

    assessment.questions.each do |question|
      case question['type']
      when 'yes_no'
        max_score += question['points'].values.max.to_i if question['points'].is_a?(Hash)
      when 'multiple_choice'
        if question['options'].is_a?(Array)
          max_points = question['options'].map { |opt| opt['points'].to_i }.max || 0
          max_score += max_points
        end
      when 'scale'
        points_per_level = question['points_per_level'] || 1
        max_value = question['max_value'] || 5
        max_score += (max_value * points_per_level)
      end
    end

    max_score
  end
end
