class BlogPost < ApplicationRecord
  include PgSearch::Model

  # ActionText
  has_rich_text :content

  # Associations
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'

  # Enums
  enum status: {
    draft: 0,
    published: 1,
    archived: 2
  }, _prefix: true

  enum category: {
    therapy_tips: 'therapy_tips',
    product_guides: 'product_guides',
    milestones: 'milestones',
    parent_resources: 'parent_resources',
    expert_insights: 'expert_insights',
    success_stories: 'success_stories'
  }, _prefix: true

  # Validations
  validates :title, presence: true, length: { minimum: 2, maximum: 200 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :category, presence: true
  validates :status, presence: true
  validates :author, presence: true
  validates :excerpt, length: { maximum: 500 }, allow_blank: true
  validates :reading_time_minutes, numericality: { only_integer: true, greater_than: 0, allow_nil: true }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }
  before_validation :calculate_reading_time, if: -> { content.present? && reading_time_minutes.nil? }
  before_save :set_published_at, if: -> { status_changed? && status_published? && published_at.nil? }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { title: 'A', excerpt: 'B' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(deleted_at: nil) }
  scope :published, -> { where(status: :published).where.not(published_at: nil).where('published_at <= ?', Time.current) }
  scope :by_category, ->(category) { where(category: category) }
  scope :by_status, ->(status) { where(status: status) }
  scope :featured, -> { where(featured: true) }
  scope :by_author, ->(author_id) { where(author_id: author_id) }
  scope :recent, -> { order(published_at: :desc, created_at: :desc) }
  scope :popular, -> { order(view_count: :desc) }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }

  # Methods
  def increment_view_count
    increment!(:view_count)
  end

  def soft_delete
    update(deleted_at: Time.current, status: :archived)
  end

  def restore
    update(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end

  def published?
    status_published? && published_at.present? && published_at <= Time.current
  end

  def add_comment(author_name:, author_email:, comment_text:)
    new_comment = {
      id: SecureRandom.uuid,
      author_name: author_name,
      author_email: author_email,
      comment_text: comment_text,
      created_at: Time.current.iso8601,
      approved: false
    }

    self.comments = (comments || []) + [new_comment]
    save
  end

  def approve_comment(comment_id)
    return false if comments.blank?

    comment = comments.find { |c| c['id'] == comment_id }
    return false unless comment

    comment['approved'] = true
    save
  end

  def approved_comments
    (comments || []).select { |c| c['approved'] == true }
  end

  def pending_comments
    (comments || []).select { |c| c['approved'] == false }
  end

  def category_display_name
    category.to_s.titleize
  end

  def status_display_name
    status.to_s.titleize
  end

  private

  def generate_slug
    self.slug = title.parameterize if title.present?
  end

  def calculate_reading_time
    # Estimate 200 words per minute
    return unless content.present?

    text = content.to_plain_text
    word_count = text.split.size
    self.reading_time_minutes = [(word_count / 200.0).ceil, 1].max
  end

  def set_published_at
    self.published_at = Time.current
  end
end
