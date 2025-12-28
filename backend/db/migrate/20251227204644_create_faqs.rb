class CreateFaqs < ActiveRecord::Migration[7.1]
  def change
    create_table :faqs do |t|
      t.string :question, null: false
      t.text :answer, null: false
      t.string :category, null: false
      t.integer :display_order, default: 0
      t.boolean :active, default: true
      t.integer :view_count, default: 0
      t.jsonb :metadata, default: {}
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :faqs, :category
    add_index :faqs, :active
    add_index :faqs, :display_order
    add_index :faqs, :deleted_at
  end
end
