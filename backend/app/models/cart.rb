class Cart < ApplicationRecord
  TAX_RATE = 0.10 # 10% tax

  # Associations
  belongs_to :user
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items

  # Methods
  def total_items
    cart_items.sum(:quantity)
  end

  def subtotal
    cart_items.includes(:product, :product_variant).sum(&:total_price)
  end

  def tax_amount
    (subtotal * TAX_RATE).round(2)
  end

  def total
    subtotal + tax_amount
  end

  def total_with_discount(coupon = nil)
    discount = coupon&.calculate_discount(subtotal) || 0
    [(total - discount).round(2), 0].max
  end

  def clear
    cart_items.destroy_all
  end

  def add_item(product, quantity = 1, product_variant = nil)
    item = cart_items.find_or_initialize_by(
      product: product,
      product_variant: product_variant
    )
    item.quantity = (item.quantity || 0) + quantity
    item.save
    item
  end

  def remove_item(cart_item_id)
    cart_items.find_by(id: cart_item_id)&.destroy
  end

  def update_item_quantity(cart_item_id, quantity)
    item = cart_items.find_by(id: cart_item_id)
    return unless item

    if quantity.positive?
      item.update(quantity: quantity)
    else
      item.destroy
    end
  end

  def empty?
    cart_items.empty?
  end
end
