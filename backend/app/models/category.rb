class Category < ApplicationRecord
  # Associations
  has_many :products, dependent: :nullify
  belongs_to :parent, class_name: 'Category', optional: true
  has_many :subcategories, class_name: 'Category', foreign_key: 'parent_id', dependent: :destroy

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }

  # Scopes
  scope :active, -> { where(active: true, deleted_at: nil) }
  scope :by_position, -> { order(position: :asc) }
  scope :top_level, -> { where(parent_id: nil) }

  # Soft delete
  def soft_delete
    update(deleted_at: Time.current, active: false)
  end

  def restore
    update(deleted_at: nil, active: true)
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present?
  end
end
