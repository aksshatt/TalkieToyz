class OrderItem < ApplicationRecord
  # Associations
  belongs_to :order
  belongs_to :product
  belongs_to :product_variant, optional: true

  # Validations
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :unit_price, :total_price, presence: true, numericality: { greater_than: 0 }

  # Callbacks
  before_validation :set_prices, if: -> { product.present? }
  before_create :snapshot_product

  # Methods
  def item_name
    if product_variant
      "#{product.name} - #{product_variant.name}"
    else
      product.name
    end
  end

  private

  def set_prices
    self.unit_price ||= product_variant&.price || product.price
    self.total_price = unit_price * quantity
  end

  def snapshot_product
    self.product_snapshot = {
      name: product.name,
      description: product.description,
      sku: product.sku,
      variant: product_variant&.attributes,
      images: product.images.attached? ? product.images.map { |img| rails_blob_url(img) } : []
    }
  rescue StandardError => e
    # Fallback if rails_blob_url is not available in this context
    self.product_snapshot = {
      name: product.name,
      description: product.description,
      sku: product.sku,
      variant: product_variant&.attributes
    }
  end
end
