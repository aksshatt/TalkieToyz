class CreateMessageTemplates < ActiveRecord::Migration[7.1]
  def change
    create_table :message_templates do |t|
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :content, null: false
      t.string :category  # e.g. 'greeting', 'progress', 'reminder', 'exercise'
      t.boolean :shared, default: false  # true = visible to all therapists; false = private
      t.timestamps
    end
  end
end
