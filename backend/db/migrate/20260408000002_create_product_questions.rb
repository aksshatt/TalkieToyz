class CreateProductQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :product_questions do |t|
      t.references :product, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :question, null: false
      t.text :answer
      t.references :answered_by, null: true, foreign_key: { to_table: :users }
      t.datetime :answered_at
      t.boolean :approved, default: true, null: false

      t.timestamps
    end

    add_index :product_questions, [:product_id, :approved]
  end
end
