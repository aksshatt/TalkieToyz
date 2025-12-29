class SiteContent < ApplicationRecord
  # Content types
  CONTENT_TYPES = {
    text: 'text',
    textarea: 'textarea',
    html: 'html',
    image: 'image',
    url: 'url',
    json: 'json'
  }.freeze

  # Pages
  PAGES = {
    home: 'home',
    about: 'about',
    contact: 'contact',
    faq: 'faq',
    footer: 'footer',
    header: 'header'
  }.freeze

  # Validations
  validates :key, presence: true, uniqueness: { scope: :page }
  validates :page, presence: true, inclusion: { in: PAGES.values }
  validates :content_type, presence: true, inclusion: { in: CONTENT_TYPES.values }
  validates :value, presence: true
  validates :display_order, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Scopes
  scope :active, -> { where(active: true) }
  scope :by_page, ->(page) { where(page: page) }
  scope :ordered, -> { order(display_order: :asc, created_at: :asc) }
  scope :by_key, ->(key) { where(key: key) }

  # Methods
  def self.get_content(page, key, default = nil)
    content = active.find_by(page: page, key: key)
    content&.value || default
  end

  def self.get_page_contents(page)
    active.by_page(page).ordered.pluck(:key, :value).to_h
  end

  def parsed_value
    case content_type
    when 'json'
      JSON.parse(value) rescue {}
    else
      value
    end
  end
end
