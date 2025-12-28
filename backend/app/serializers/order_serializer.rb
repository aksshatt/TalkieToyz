class OrderSerializer < ApplicationSerializer
  attributes :id, :order_number, :status, :payment_method, :payment_status,
             :subtotal, :tax, :shipping_cost, :discount, :total,
             :shipping_address, :billing_address, :tracking_number,
             :shipped_at, :delivered_at, :notes, :customer_notes,
             :created_at, :updated_at

  belongs_to :coupon, serializer: CouponSerializer, if: :coupon?
  has_many :order_items, serializer: OrderItemSerializer

  def subtotal
    object.subtotal.to_f.round(2)
  end

  def tax
    object.tax.to_f.round(2)
  end

  def shipping_cost
    object.shipping_cost.to_f.round(2)
  end

  def discount
    object.discount.to_f.round(2)
  end

  def total
    object.total.to_f.round(2)
  end

  def coupon?
    object.coupon.present?
  end
end
