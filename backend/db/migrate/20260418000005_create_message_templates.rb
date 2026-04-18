class CreateMessageTemplates < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:message_templates)
      create_table :message_templates do |t|
        t.references :created_by, null: false, foreign_key: { to_table: :users }
        t.string :title, null: false
        t.text :content, null: false
        t.string :category
        t.boolean :shared, default: false
        t.timestamps
      end
    end
  end
end
