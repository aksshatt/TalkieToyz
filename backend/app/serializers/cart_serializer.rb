class CartSerializer < ApplicationSerializer
  attributes :id, :total_items, :subtotal, :tax_amount, :total, :created_at, :updated_at

  has_many :cart_items, serializer: CartItemSerializer

  def total_items
    object.total_items
  end

  def subtotal
    object.subtotal.to_f.round(2)
  end

  def tax_amount
    object.tax_amount.to_f.round(2)
  end

  def total
    object.total.to_f.round(2)
  end
end
