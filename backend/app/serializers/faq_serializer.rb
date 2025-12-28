class FaqSerializer < ApplicationSerializer
  attributes :id, :question, :answer, :category, :category_display_name,
             :display_order, :active, :view_count, :created_at, :updated_at

  def category_display_name
    object.category_display_name
  end
end
