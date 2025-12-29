class SiteContentSerializer < ActiveModel::Serializer
  attributes :id,
             :key,
             :page,
             :content_type,
             :value,
             :label,
             :description,
             :active,
             :display_order,
             :metadata,
             :created_at,
             :updated_at

  # Add parsed value for JSON content types
  attribute :parsed_value

  def parsed_value
    object.parsed_value
  end
end
