class AddGiftWrapToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :gift_wrap, :boolean, default: false, null: false
    add_column :orders, :gift_message, :text
  end
end
