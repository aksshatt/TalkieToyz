# frozen_string_literal: true

class CreateReviews < ActiveRecord::Migration[7.1]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :rating, null: false
      t.string :title
      t.text :comment
      t.boolean :verified_purchase, default: false
      t.boolean :approved, default: false
      t.integer :helpful_count, default: 0
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :reviews, [:user_id, :product_id], unique: true
    add_index :reviews, :rating
    add_index :reviews, :approved
    add_index :reviews, :deleted_at
    add_index :reviews, :created_at
  end
end
