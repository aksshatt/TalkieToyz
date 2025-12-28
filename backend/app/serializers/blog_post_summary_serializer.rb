class BlogPostSummarySerializer < ApplicationSerializer
  attributes :id, :title, :slug, :excerpt, :featured_image_url, :category,
             :category_display_name, :tags, :status, :status_display_name,
             :published_at, :view_count, :reading_time_minutes, :featured,
             :comment_count, :created_at, :updated_at

  belongs_to :author, serializer: UserSerializer

  def category_display_name
    object.category_display_name
  end

  def status_display_name
    object.status_display_name
  end

  def comment_count
    object.approved_comments.length
  end
end
