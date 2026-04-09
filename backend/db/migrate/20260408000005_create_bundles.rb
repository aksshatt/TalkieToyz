class CreateBundles < ActiveRecord::Migration[7.1]
  def change
    create_table :bundles do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :speech_goal
      t.decimal :discount_percent, precision: 5, scale: 2, default: 10.0
      t.boolean :active, default: true, null: false
      t.boolean :featured, default: false, null: false
      t.integer :min_products, default: 3
      t.integer :max_products, default: 5

      t.timestamps
    end

    add_index :bundles, :slug, unique: true
    add_index :bundles, :active

    create_table :bundle_items do |t|
      t.references :bundle, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :position, default: 0

      t.timestamps
    end

    add_index :bundle_items, [:bundle_id, :product_id], unique: true
  end
end
