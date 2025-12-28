class AddCouponToOrders < ActiveRecord::Migration[7.1]
  def change
    add_reference :orders, :coupon, null: false, foreign_key: true
  end
end
