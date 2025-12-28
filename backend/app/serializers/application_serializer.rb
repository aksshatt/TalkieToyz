class ApplicationSerializer < ActiveModel::Serializer
  # Base serializer for common functionality
  # All serializers should inherit from this class

  def created_at
    object.created_at&.iso8601
  end

  def updated_at
    object.updated_at&.iso8601
  end
end
