class CreateMilestoneAchievements < ActiveRecord::Migration[7.1]
  def change
    create_table :milestone_achievements do |t|
      t.references :user, null: false, foreign_key: true
      t.references :child_profile, null: true, foreign_key: true
      t.references :milestone, null: false, foreign_key: true
      t.datetime :achieved_at, null: false
      t.boolean :certificate_shared, default: false

      t.timestamps
    end

    add_index :milestone_achievements, [:user_id, :milestone_id]
    add_index :milestone_achievements, [:child_profile_id, :milestone_id], unique: true
  end
end
