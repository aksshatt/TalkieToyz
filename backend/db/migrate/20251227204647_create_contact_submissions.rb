class CreateContactSubmissions < ActiveRecord::Migration[7.1]
  def change
    create_table :contact_submissions do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone
      t.string :subject, null: false
      t.text :message, null: false
      t.string :status, default: 'pending'
      t.references :user, foreign_key: true, null: true
      t.text :admin_notes
      t.datetime :responded_at
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :contact_submissions, :email
    add_index :contact_submissions, :status
    add_index :contact_submissions, :created_at
  end
end
