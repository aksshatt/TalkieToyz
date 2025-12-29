class CreateSiteContents < ActiveRecord::Migration[7.1]
  def change
    create_table :site_contents do |t|
      t.string :key, null: false
      t.string :content_type, null: false, default: 'text'
      t.text :value
      t.string :page, null: false
      t.jsonb :metadata, default: {}
      t.boolean :active, default: true
      t.integer :display_order, default: 0
      t.string :label
      t.text :description

      t.timestamps
    end

    add_index :site_contents, [:page, :key], unique: true
    add_index :site_contents, :page
    add_index :site_contents, :active
    add_index :site_contents, :display_order
  end
end
