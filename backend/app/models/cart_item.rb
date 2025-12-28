class CartItem < ApplicationRecord
  # Associations
  belongs_to :cart
  belongs_to :product
  belongs_to :product_variant, optional: true

  # Validations
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :product_id, uniqueness: { scope: [:cart_id, :product_variant_id] }
  validate :product_must_be_available
  validate :variant_must_belong_to_product

  # Methods
  def total_price
    item_price * quantity
  end

  def item_price
    product_variant&.price || product.price
  end

  def item_name
    if product_variant
      "#{product.name} - #{product_variant.name}"
    else
      product.name
    end
  end

  def available_stock
    product_variant&.stock_quantity || product.stock_quantity
  end

  private

  def product_must_be_available
    return unless product

    if product_variant
      unless product_variant.active? && product_variant.stock_quantity > 0
        errors.add(:product_variant, 'is out of stock or inactive')
      end
    else
      unless product.in_stock?
        errors.add(:product, 'is out of stock')
      end
    end
  end

  def variant_must_belong_to_product
    if product_variant && product && product_variant.product_id != product.id
      errors.add(:product_variant, 'does not belong to the selected product')
    end
  end
end
