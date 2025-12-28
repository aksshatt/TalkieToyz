class CouponSerializer < ApplicationSerializer
  attributes :id, :code, :discount_type, :discount_value, :description,
             :min_order_amount, :max_discount_amount,
             :valid_from, :valid_until, :can_be_used

  def discount_value
    object.discount_value.to_f.round(2)
  end

  def min_order_amount
    object.min_order_amount&.to_f&.round(2)
  end

  def max_discount_amount
    object.max_discount_amount&.to_f&.round(2)
  end

  def can_be_used
    object.can_be_used?
  end
end
