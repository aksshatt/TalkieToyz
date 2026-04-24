class SpeechGoal < ApplicationRecord
  # Associations
  has_many :product_speech_goals, dependent: :destroy
  has_many :products, through: :product_speech_goals

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9\-]+\z/ }
  validates :color, format: { with: /\A#[0-9A-F]{6}\z/i, allow_blank: true }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }

  # Scopes
  scope :active, -> { where(active: true) }

  private

  def generate_slug
    return unless name.present?

    base = name.parameterize
    candidate = base
    suffix = 2
    while self.class.where.not(id: id).exists?(slug: candidate)
      candidate = "#{base}-#{suffix}"
      suffix += 1
    end
    self.slug = candidate
  end
end
