# frozen_string_literal: true

class CreateSpeechGoals < ActiveRecord::Migration[7.1]
  def change
    create_table :speech_goals do |t|
      t.string :name, null: false
      t.text :description
      t.string :slug, null: false
      t.string :color, default: '#3B82F6'
      t.string :icon, default: 'target'
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :speech_goals, :slug, unique: true
    add_index :speech_goals, :active
  end
end
