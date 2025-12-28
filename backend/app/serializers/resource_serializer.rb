class ResourceSerializer < ApplicationSerializer
  attributes :id, :title, :slug, :description, :resource_type, :resource_type_display_name,
             :file_size_bytes, :file_size_display, :file_format, :download_count,
             :tags, :metadata, :premium, :active, :file_url, :created_at, :updated_at

  belongs_to :resource_category, serializer: ResourceCategorySerializer

  def resource_type_display_name
    object.resource_type_display_name
  end

  def file_size_display
    object.file_size_display
  end

  def file_url
    object.file_url
  end
end
