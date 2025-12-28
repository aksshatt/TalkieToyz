class ResourceCategory < ApplicationRecord
  # Associations
  has_many :resources, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }

  # Scopes
  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:position, :name) }

  # Methods
  def resources_count
    resources.active.count
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present?
  end
end
