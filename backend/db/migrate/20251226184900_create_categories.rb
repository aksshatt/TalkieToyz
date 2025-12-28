# frozen_string_literal: true

class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.text :description
      t.string :slug, null: false
      t.integer :position, default: 0
      t.boolean :active, default: true
      t.string :image_url
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :categories, :slug, unique: true
    add_index :categories, :position
    add_index :categories, :active
    add_index :categories, :deleted_at
  end
end
