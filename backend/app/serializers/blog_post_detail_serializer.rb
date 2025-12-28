class BlogPostDetailSerializer < ApplicationSerializer
  attributes :id, :title, :slug, :excerpt, :content_html, :featured_image_url,
             :category, :category_display_name, :tags, :status, :status_display_name,
             :published_at, :view_count, :reading_time_minutes, :featured,
             :allow_comments, :approved_comments, :seo_metadata,
             :created_at, :updated_at

  belongs_to :author, serializer: UserSerializer

  def content_html
    object.content.to_s
  end

  def category_display_name
    object.category_display_name
  end

  def status_display_name
    object.status_display_name
  end

  def approved_comments
    object.approved_comments
  end
end
