class ResourceCategorySerializer < ApplicationSerializer
  attributes :id, :name, :slug, :description, :icon, :color, :position,
             :active, :resources_count, :created_at, :updated_at

  def resources_count
    object.resources_count
  end
end
