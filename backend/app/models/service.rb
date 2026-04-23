class Service < ApplicationRecord
  has_many :appointments, dependent: :nullify

  validates :name, presence: true, length: { minimum: 2, maximum: 120 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :duration_minutes, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  before_validation :generate_slug, if: -> { slug.blank? && name.present? }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(display_order: :asc, name: :asc) }

  private

  def generate_slug
    self.slug = name.parameterize
  end
end
