class AddShippingFieldsToOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :orders, :weight_kg, :decimal, precision: 8, scale: 3, default: 0.5
    add_column :orders, :dimensions_cm, :jsonb, default: { length: 10, breadth: 10, height: 5 }
  end
end
