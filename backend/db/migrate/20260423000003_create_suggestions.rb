class CreateSuggestions < ActiveRecord::Migration[7.1]
  def change
    create_table :suggestions do |t|
      t.text :message, null: false
      t.string :name
      t.string :email
      t.boolean :reviewed, default: false, null: false

      t.timestamps
    end

    add_index :suggestions, :reviewed
    add_index :suggestions, :created_at
  end
end
