class CreateResources < ActiveRecord::Migration[7.1]
  def change
    create_table :resources do |t|
      t.references :resource_category, null: false, foreign_key: true
      t.string :title, null: false
      t.string :slug, null: false
      t.text :description
      t.string :resource_type, null: false
      t.integer :file_size_bytes
      t.string :file_format
      t.integer :download_count, default: 0
      t.jsonb :tags, default: []
      t.jsonb :metadata, default: {}
      t.boolean :premium, default: false
      t.boolean :active, default: true
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :resources, :slug, unique: true
    add_index :resources, :resource_type
    add_index :resources, :premium
    add_index :resources, :active
    add_index :resources, :tags, using: :gin
    add_index :resources, :deleted_at
  end
end
