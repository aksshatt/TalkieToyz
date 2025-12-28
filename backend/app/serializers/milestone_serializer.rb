class MilestoneSerializer < ApplicationSerializer
  attributes :id, :title, :description, :category, :category_display_name,
             :age_months_min, :age_months_max, :age_range_description, :age_range_years,
             :position, :indicators, :tips, :active, :created_at, :updated_at

  def category_display_name
    object.category_display_name
  end

  def age_range_description
    object.age_range_description
  end

  def age_range_years
    object.age_range_years
  end
end
