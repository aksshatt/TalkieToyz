class CreateServices < ActiveRecord::Migration[7.1]
  def change
    create_table :services do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, default: 0, null: false
      t.integer :duration_minutes, default: 45
      t.integer :display_order, default: 0
      t.boolean :active, default: true
      t.string :image_url
      t.string :icon

      t.timestamps
    end

    add_index :services, :slug, unique: true
    add_index :services, :active
    add_index :services, :display_order
  end
end
