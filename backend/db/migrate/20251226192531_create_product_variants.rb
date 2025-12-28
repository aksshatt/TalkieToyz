class CreateProductVariants < ActiveRecord::Migration[7.1]
  def change
    create_table :product_variants do |t|
      t.references :product, null: false, foreign_key: true
      t.string :name, null: false
      t.string :sku, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :stock_quantity, default: 0, null: false
      t.jsonb :specifications, default: {}
      t.boolean :active, default: true, null: false
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :product_variants, :sku, unique: true
    add_index :product_variants, :active
    add_index :product_variants, :deleted_at
    add_index :product_variants, :specifications, using: :gin
  end
end
