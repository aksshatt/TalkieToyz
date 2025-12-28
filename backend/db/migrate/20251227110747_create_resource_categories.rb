class CreateResourceCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :resource_categories do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :icon
      t.string :color
      t.integer :position, default: 0
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :resource_categories, :slug, unique: true
    add_index :resource_categories, :position
    add_index :resource_categories, :active
  end
end
