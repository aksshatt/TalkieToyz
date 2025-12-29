class OrderSerializer < ApplicationSerializer
  attributes :id, :order_number, :status, :payment_method, :payment_status,
             :subtotal, :tax, :shipping_cost, :discount, :total,
             :shipping_address, :billing_address, :tracking_number,
             :shipped_at, :delivered_at, :notes, :customer_notes,
             :refund_status, :refund_amount, :refunded_at,
             :tracking_url, :estimated_delivery,
             :created_at, :updated_at

  belongs_to :coupon, serializer: CouponSerializer, if: :coupon?
  has_many :order_items, serializer: OrderItemSerializer
  has_one :shipment, serializer: ShipmentSerializer, if: :shipment?

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

  def shipment?
    object.shipment.present?
  end

  def refund_amount
    object.refund_amount&.to_f&.round(2)
  end

  def tracking_url
    object.shipment&.tracking_url
  end

  def estimated_delivery
    object.shipment&.shipment_details&.dig('edd')
  end
end
