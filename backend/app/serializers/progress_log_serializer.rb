class ProgressLogSerializer < ApplicationSerializer
  attributes :id, :child_name, :child_age_months, :age_display, :log_date,
             :category, :category_display_name, :notes, :metrics, :achievements,
             :created_at, :updated_at

  belongs_to :milestone, serializer: MilestoneSerializer, optional: true
  belongs_to :product, serializer: ProductSummarySerializer, optional: true

  def age_display
    object.age_display
  end

  def category_display_name
    object.category_display_name
  end
end
