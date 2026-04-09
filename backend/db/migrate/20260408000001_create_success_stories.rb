class CreateSuccessStories < ActiveRecord::Migration[7.1]
  def change
    create_table :success_stories do |t|
      t.references :user, null: false, foreign_key: true
      t.string :child_name, null: false
      t.integer :age_months
      t.string :speech_goal
      t.text :before_text, null: false
      t.text :after_text, null: false
      t.references :product, null: true, foreign_key: true
      t.boolean :approved, default: false, null: false
      t.boolean :featured, default: false, null: false

      t.timestamps
    end

    add_index :success_stories, :approved
    add_index :success_stories, :featured
    add_index :success_stories, [:approved, :featured]
  end
end
