class CreateCoupons < ActiveRecord::Migration[7.1]
  def change
    create_table :coupons do |t|
      t.string :code, null: false
      t.string :discount_type, null: false # 'percentage' or 'fixed'
      t.decimal :discount_value, precision: 10, scale: 2, null: false
      t.decimal :min_order_amount, precision: 10, scale: 2, default: 0
      t.decimal :max_discount_amount, precision: 10, scale: 2
      t.datetime :valid_from
      t.datetime :valid_until
      t.integer :usage_limit, default: 0 # 0 means unlimited
      t.integer :usage_count, default: 0, null: false
      t.boolean :active, default: true, null: false
      t.text :description

      t.timestamps
    end

    add_index :coupons, :code, unique: true
    add_index :coupons, :active
    add_index :coupons, :valid_until
  end
end
