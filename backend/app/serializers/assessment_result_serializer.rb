class AssessmentResultSerializer < ApplicationSerializer
  attributes :id, :child_name, :child_age_months, :answers, :scores,
             :total_score, :percentage_score, :recommendations, :completed_at,
             :created_at, :updated_at

  belongs_to :assessment, serializer: AssessmentSummarySerializer

  def percentage_score
    object.percentage_score
  end
end
