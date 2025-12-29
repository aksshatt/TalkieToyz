class AddRefundFieldsToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :refund_status, :integer, default: 0, null: false
    add_column :orders, :refund_amount, :decimal, precision: 10, scale: 2
    add_column :orders, :refunded_at, :datetime
    add_column :orders, :refund_details, :jsonb, default: {}

    add_index :orders, :refund_status
    add_index :orders, :refunded_at
  end
end
