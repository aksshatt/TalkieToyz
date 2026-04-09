class CreateChildProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :child_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.date :date_of_birth
      t.text :speech_goals, array: true, default: []
      t.text :notes
      t.string :avatar_color, default: '#6366f1'

      t.timestamps
    end
  end
end
