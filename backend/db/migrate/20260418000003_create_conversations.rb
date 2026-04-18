class CreateConversations < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:conversations)
      create_table :conversations do |t|
        t.references :therapist, null: false, foreign_key: { to_table: :users }
        t.references :patient,   null: false, foreign_key: { to_table: :users }
        t.datetime :last_message_at
        t.integer :unread_by_patient,   default: 0, null: false
        t.integer :unread_by_therapist, default: 0, null: false
        t.timestamps
      end
    end

    unless index_exists?(:conversations, [:therapist_id, :patient_id])
      add_index :conversations, [:therapist_id, :patient_id], unique: true
    end
  end
end
