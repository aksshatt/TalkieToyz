class CartItemSerializer < ApplicationSerializer
  attributes :id, :quantity, :item_price, :total_price, :item_name, :available_stock,
             :product, :product_variant, :created_at, :updated_at

  def item_price
    object.item_price.to_f.round(2)
  end

  def total_price
    object.total_price.to_f.round(2)
  end

  def item_name
    object.item_name
  end

  def available_stock
    object.available_stock
  end

  def product
    ProductSummarySerializer.new(object.product).as_json if object.product
  end

  def product_variant
    ProductVariantSerializer.new(object.product_variant).as_json if object.product_variant.present?
  end
end
