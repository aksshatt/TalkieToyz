class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :messages do |t|
      t.references :conversation, null: false, foreign_key: true
      t.references :sender, null: false, foreign_key: { to_table: :users }
      # message_type: text | product | assessment | template
      t.string :message_type, default: 'text', null: false
      t.text :content
      # For product/assessment shares: { product_id, product_slug, product_name, image_url }
      #                                 { assessment_id, assessment_slug, assessment_title }
      t.jsonb :metadata, default: {}
      t.datetime :read_at
      t.timestamps
    end

    add_index :messages, :message_type
    add_index :messages, :created_at
  end
end
