# frozen_string_literal: true

class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.string :order_number, null: false
      t.integer :status, default: 0, null: false

      # Pricing
      t.decimal :subtotal, precision: 10, scale: 2, null: false
      t.decimal :tax, precision: 10, scale: 2, default: 0
      t.decimal :shipping_cost, precision: 10, scale: 2, default: 0
      t.decimal :discount, precision: 10, scale: 2, default: 0
      t.decimal :total, precision: 10, scale: 2, null: false

      # Shipping
      t.jsonb :shipping_address, default: {}
      t.jsonb :billing_address, default: {}
      t.string :tracking_number
      t.datetime :shipped_at
      t.datetime :delivered_at

      # Payment
      t.string :payment_method
      t.string :payment_status
      t.string :payment_intent_id
      t.jsonb :payment_details, default: {}

      # Additional info
      t.text :notes
      t.text :customer_notes

      t.timestamps
    end

    add_index :orders, :order_number, unique: true
    add_index :orders, :status
    add_index :orders, :payment_status
    add_index :orders, :created_at
    add_index :orders, :shipping_address, using: :gin
    add_index :orders, :billing_address, using: :gin
  end
end
