class AssessmentDetailSerializer < ApplicationSerializer
  attributes :id, :title, :description, :slug, :min_age, :max_age,
             :questions, :scoring_rules, :recommendations, :active, :version,
             :question_count, :created_at, :updated_at

  def question_count
    object.questions&.length || 0
  end
end
