class OrderItemSerializer < ApplicationSerializer
  attributes :id, :quantity, :unit_price, :total_price, :item_name, :product_snapshot

  belongs_to :product, serializer: ProductSummarySerializer
  belongs_to :product_variant, serializer: ProductVariantSerializer, if: :product_variant?

  def unit_price
    object.unit_price.to_f.round(2)
  end

  def total_price
    object.total_price.to_f.round(2)
  end

  def product_variant?
    object.product_variant.present?
  end
end
