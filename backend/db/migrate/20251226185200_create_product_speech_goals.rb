# frozen_string_literal: true

class CreateProductSpeechGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :product_speech_goals do |t|
      t.references :product, null: false, foreign_key: true
      t.references :speech_goal, null: false, foreign_key: true

      t.timestamps
    end

    add_index :product_speech_goals, [:product_id, :speech_goal_id], unique: true, name: 'index_product_speech_goals_unique'
  end
end
