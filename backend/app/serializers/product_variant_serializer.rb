class ProductVariantSerializer < ApplicationSerializer
  attributes :id, :name, :sku, :price, :stock_quantity, :specifications, :active, :in_stock

  def in_stock
    object.in_stock?
  end
end
