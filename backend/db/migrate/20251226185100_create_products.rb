# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.text :long_description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.decimal :compare_at_price, precision: 10, scale: 2
      t.integer :stock_quantity, default: 0, null: false
      t.string :sku
      t.string :slug, null: false
      t.references :category, foreign_key: true

      # Age range
      t.integer :min_age
      t.integer :max_age

      # Product specifications
      t.jsonb :specifications, default: {}
      t.jsonb :images, default: []

      # Status
      t.boolean :active, default: true
      t.boolean :featured, default: false
      t.integer :view_count, default: 0
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :products, :slug, unique: true
    add_index :products, :sku, unique: true
    add_index :products, :active
    add_index :products, :featured
    add_index :products, :price
    add_index :products, :min_age
    add_index :products, :max_age
    add_index :products, :deleted_at
    add_index :products, :specifications, using: :gin
    add_index :products, :images, using: :gin
  end
end
