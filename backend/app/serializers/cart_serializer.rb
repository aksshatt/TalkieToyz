class CartSerializer < ApplicationSerializer
  attributes :id, :total_items, :subtotal, :tax_amount, :total, :stock_warnings, :created_at, :updated_at

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

  def stock_warnings
    object.cart_items.select { |item| item.quantity > item.available_stock }.map do |item|
      {
        cart_item_id: item.id,
        item_name: item.item_name,
        requested_quantity: item.quantity,
        available_stock: item.available_stock
      }
    end
  end
end
