# frozen_string_literal: true

class CreateCarts < ActiveRecord::Migration[7.1]
  def change
    create_table :carts do |t|
      t.references :user, null: false, foreign_key: true
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :carts, :metadata, using: :gin
  end
end
