class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:messages)
      create_table :messages do |t|
        t.references :conversation, null: false, foreign_key: true
        t.references :sender, null: false, foreign_key: { to_table: :users }
        t.string :message_type, default: 'text', null: false
        t.text :content
        t.jsonb :metadata, default: {}
        t.datetime :read_at
        t.timestamps
      end
    end

    add_index :messages, :message_type unless index_exists?(:messages, :message_type)
    add_index :messages, :created_at   unless index_exists?(:messages, :created_at)
  end
end
