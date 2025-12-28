class Resource < ApplicationRecord
  include PgSearch::Model

  # ActiveStorage
  has_one_attached :file

  # Associations
  belongs_to :resource_category

  # Enums
  enum resource_type: {
    pdf: 'pdf',
    worksheet: 'worksheet',
    guide: 'guide',
    checklist: 'checklist',
    template: 'template',
    infographic: 'infographic',
    video: 'video',
    audio: 'audio'
  }, _prefix: true

  # Validations
  validates :title, presence: true, length: { minimum: 2, maximum: 200 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :resource_type, presence: true
  validates :resource_category, presence: true

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }
  after_save :extract_file_metadata, if: -> { file.attached? && saved_change_to_id? }

  # Full-text search
  pg_search_scope :search_full_text,
                  against: { title: 'A', description: 'B' },
                  using: {
                    tsearch: { prefix: true, dictionary: 'english' }
                  }

  # Scopes
  scope :active, -> { where(active: true, deleted_at: nil) }
  scope :by_category, ->(category_id) { where(resource_category_id: category_id) }
  scope :by_type, ->(type) { where(resource_type: type) }
  scope :premium, -> { where(premium: true) }
  scope :free, -> { where(premium: false) }
  scope :recent, -> { order(created_at: :desc) }
  scope :popular, -> { order(download_count: :desc) }
  scope :search, ->(query) { query.present? ? search_full_text(query) : all }

  # Methods
  def increment_download_count
    increment!(:download_count)
  end

  def soft_delete
    update(deleted_at: Time.current, active: false)
  end

  def restore
    update(deleted_at: nil, active: true)
  end

  def deleted?
    deleted_at.present?
  end

  def file_url
    return nil unless file.attached?

    Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true)
  end

  def resource_type_display_name
    resource_type.to_s.titleize
  end

  def file_size_display
    return 'N/A' unless file_size_bytes.present?

    if file_size_bytes < 1024
      "#{file_size_bytes} B"
    elsif file_size_bytes < 1_048_576
      "#{(file_size_bytes / 1024.0).round(2)} KB"
    else
      "#{(file_size_bytes / 1_048_576.0).round(2)} MB"
    end
  end

  private

  def generate_slug
    self.slug = title.parameterize if title.present?
  end

  def extract_file_metadata
    return unless file.attached?

    self.file_size_bytes = file.blob.byte_size
    self.file_format = file.blob.content_type

    save if changed?
  end
end
