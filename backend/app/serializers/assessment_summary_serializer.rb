class AssessmentSummarySerializer < ApplicationSerializer
  attributes :id, :title, :description, :slug, :min_age, :max_age,
             :question_count, :active, :version, :created_at, :updated_at

  def question_count
    object.questions&.length || 0
  end
end
