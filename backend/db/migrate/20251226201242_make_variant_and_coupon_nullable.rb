class MakeVariantAndCouponNullable < ActiveRecord::Migration[7.1]
  def change
    change_column_null :cart_items, :product_variant_id, true
    change_column_null :order_items, :product_variant_id, true
    change_column_null :orders, :coupon_id, true
  end
end
